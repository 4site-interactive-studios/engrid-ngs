/**
 * "click-to-expand mobile-only": collapsed with "Learn More" below 800px,
 * full text on desktop (visuals in ngs.scss). ENgrid marks the collapsed text
 * aria-hidden, so this un-hides it for screen readers while it's visible.
 */
export default class ClickToExpandMobileOnly {
  constructor() {
    const desktop = window.matchMedia("(min-width: 800px)");
    const sync = () =>
      document
        .querySelectorAll(".click-to-expand.mobile-only:not(.expanded)")
        .forEach((block) =>
          block
            .querySelector(".click-to-expand-text-wrapper")
            ?.setAttribute("aria-hidden", String(!desktop.matches))
        );
    sync();
    desktop.addEventListener("change", sync);
  }
}
