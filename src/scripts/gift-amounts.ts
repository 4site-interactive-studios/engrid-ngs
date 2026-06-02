/**
 * Gift Amounts
 * @author npgiano
 * @date 02-06-2026
 */

export default class GiftAmounts {
  private monthlyHeartRadioSelector =
    '.radio-to-buttons_recurrfreq input[type="radio"][value="MONTHLY"]';
  private monthlyHeartAnimationDuration = 1500;
  private monthlyMobileHeartMediaQuery = "(max-width: 619px)";
  private monthlyMobileHeartFloatInClass = "monthly-heart-float-in";
  private monthlyMobileHeartFloatOutClass = "monthly-heart-float-out";

  constructor() {
    this.addMonthlyHeart();
    this.addRecurringGiftCallout();
    this.wrapFrequencyLabelGiveText();
    this.positionProgressBarCount();
  }

  private getMonthlyHeartFirstTextNode(node: Node): Text | null {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      return node as Text;
    }

    for (const childNode of Array.from(node.childNodes || [])) {
      const match = this.getMonthlyHeartFirstTextNode(childNode);
      if (match) return match;
    }

    return null;
  }

  private getMonthlyHeartTextRect(label: Element): DOMRect | null {
    const textNode = this.getMonthlyHeartFirstTextNode(label);

    if (!textNode) return null;

    const range = document.createRange();
    range.selectNodeContents(textNode);
    const rect = range.getBoundingClientRect();
    range.detach();
    return rect;
  }

  private spawnMonthlyHeart(label: Element, isSelected = true): void {
    if (!(label instanceof HTMLElement)) return;

    label.classList.remove(
      this.monthlyMobileHeartFloatInClass,
      this.monthlyMobileHeartFloatOutClass
    );

    // Restart the pseudo-element animation when users toggle quickly.
    label.offsetWidth;
    label.classList.add(
      isSelected
        ? this.monthlyMobileHeartFloatInClass
        : this.monthlyMobileHeartFloatOutClass
    );

    if (!isSelected) {
      window.setTimeout(() => {
        label.classList.remove(this.monthlyMobileHeartFloatOutClass);
      }, this.monthlyHeartAnimationDuration + 100);
    }

    if (window.matchMedia?.(this.monthlyMobileHeartMediaQuery)?.matches) {
      return;
    }

    if (!isSelected) return;

    const labelRect = label.getBoundingClientRect();
    const textRect = this.getMonthlyHeartTextRect(label);
    const beforeStyles = window.getComputedStyle(label, "::before");
    const staticHeartWidth = parseFloat(beforeStyles.width) || 20;
    const staticHeartMarginRight = parseFloat(beforeStyles.marginRight) || 0;
    const floatingHeartSize = 12;
    const floatingHeart = document.createElement("span");
    const left = textRect
      ? textRect.left -
        labelRect.left -
        staticHeartMarginRight -
        staticHeartWidth +
        (staticHeartWidth - floatingHeartSize) / 2
      : (staticHeartWidth - floatingHeartSize) / 2;
    const top = (labelRect.height - floatingHeartSize) / 2;

    floatingHeart.className = "monthly-heart-float";
    floatingHeart.setAttribute("aria-hidden", "true");
    floatingHeart.style.setProperty("--monthly-heart-left", `${left}px`);
    floatingHeart.style.setProperty("--monthly-heart-top", `${top}px`);

    label.appendChild(floatingHeart);
    floatingHeart.addEventListener(
      "animationend",
      () => floatingHeart.remove(),
      { once: true }
    );
    window.setTimeout(
      () => floatingHeart.remove(),
      this.monthlyHeartAnimationDuration + 100
    );
  }

  private addMonthlyHeart(): void {
    document.addEventListener("change", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLInputElement) || !target.checked) return;

      if (target.matches(this.monthlyHeartRadioSelector)) {
        const label = target.nextElementSibling;
        if (!label || !label.classList.contains("en__field__label--item")) return;

        this.spawnMonthlyHeart(label);
        return;
      }

      if (target.name !== "transaction.recurrfreq") return;

      const monthlyFrequencyInput = document.querySelector<HTMLInputElement>(
        this.monthlyHeartRadioSelector
      );
      const label = monthlyFrequencyInput?.nextElementSibling;
      if (
        monthlyFrequencyInput?.checked ||
        !label ||
        !label.classList.contains("en__field__label--item")
      )
        return;

      this.spawnMonthlyHeart(label, false);
    });
  }

  private addRecurringGiftCallout(): void {
    const recurringGiftCallout = document.querySelector(
      ".recurring-callout-left, .recurring-callout-right"
    );
    if (!recurringGiftCallout) return;

    const recurringCalloutPreviewAttribute =
      "data-ngs-recurring-callout-preview";
    const monthlyFrequencyInput = document.querySelector<HTMLInputElement>(
      '.radio-to-buttons_recurrfreq input[type="radio"][value="MONTHLY"]'
    );
    const oneTimeFrequencyInput = document.querySelector<HTMLInputElement>(
      '.radio-to-buttons_recurrfreq input[type="radio"][value="ONETIME"]'
    );
    const oneTimeFrequencyItem = oneTimeFrequencyInput?.closest(
      ".en__field__item"
    );
    let isOneTimeHovered = false;
    let isOneTimeFocused = false;

    const updateRecurringCalloutPreview = () => {
      if (
        monthlyFrequencyInput?.checked &&
        (isOneTimeHovered || isOneTimeFocused)
      ) {
        document.body.setAttribute(recurringCalloutPreviewAttribute, "onetime");
        return;
      }

      document.body.removeAttribute(recurringCalloutPreviewAttribute);
    };

    if (!oneTimeFrequencyItem) return;

    oneTimeFrequencyItem.addEventListener("pointerenter", () => {
      isOneTimeHovered = true;
      updateRecurringCalloutPreview();
    });

    oneTimeFrequencyItem.addEventListener("pointerleave", () => {
      isOneTimeHovered = false;
      updateRecurringCalloutPreview();
    });

    oneTimeFrequencyItem.addEventListener("focusin", () => {
      isOneTimeFocused = true;
      updateRecurringCalloutPreview();
    });

    oneTimeFrequencyItem.addEventListener("focusout", () => {
      isOneTimeFocused = false;
      updateRecurringCalloutPreview();
    });

    document.addEventListener("change", (event) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement &&
        target.name === "transaction.recurrfreq"
      ) {
        updateRecurringCalloutPreview();
      }
    });
  }

  private wrapFrequencyLabelGiveText(): void {
    const frequencyLabels = document.querySelectorAll(
      ".radio-to-buttons_recurrfreq .en__field__label--item"
    );
    frequencyLabels.forEach((label) => {
      if (!label.textContent?.toLowerCase().includes("give")) return;
      label.textContent = label.textContent.replace(/give/gi, " ").trim();
      const giveSpan = document.createElement("span");
      giveSpan.className = "hideif-mobile";
      giveSpan.textContent = "GIVE ";
      giveSpan.style.marginRight = ".5ch";
      label.insertAdjacentElement("afterbegin", giveSpan);
    });
  }

  private positionProgressBarCount(): void {
    const progressBar = document.querySelector(".en__component--widgetblock");
    if (!progressBar) return;

    if (progressBar.querySelector(".enWidget__fill__count")) {
      const count = progressBar.querySelector(".enWidget__fill__count");
      if (count) {
        const progress = progressBar.querySelector(".enWidget__progress");
        progress?.appendChild(count);
      }
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const count = progressBar.querySelector(".enWidget__fill__count");
          if (count) {
            const progress = progressBar.querySelector(".enWidget__progress");
            progress?.appendChild(count);
            observer.disconnect();
          }
        }
      });
    });
    observer.observe(progressBar, { childList: true, subtree: true });
  }
}
