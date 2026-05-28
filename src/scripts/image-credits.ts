/**
 * Image Credits
 * @author npgiano
 * @date 27-05-2026
 * Extracts background image credits from the page and makes them available
 * to the application. Expects a DOM structure like:
 * <div class="hide background-image-credits">
 *   <div class="background-image-credits-author">Author Name</div>
 *   <div class="background-image-credits-description">Description</div>
 * </div>
 */
import { ENGrid, EngridLogger } from "@4site/engrid-scripts";

export interface ImageCreditsConfig {
  creditsContainerSelector?: string;
  authorSelector?: string;
  descriptionSelector?: string;
}

const DEFAULT_CONFIG: ImageCreditsConfig = {
  creditsContainerSelector: ".background-image-credits",
  authorSelector: ".background-image-credits-author",
  descriptionSelector: ".background-image-credits-description",
};

export default class ImageCredits {
  private logger = new EngridLogger(
    "NGS ImageCredits",
    "#FCAB23",
    "dodgerblue",
    "📷"
  );
  private config: ImageCreditsConfig;
  private author: string | null = null;
  private description: string | null = null;

  constructor(private incomingConfig: ImageCreditsConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...incomingConfig };

    if (!this.shouldRun()) {
      this.logger.log(
        `ImageCredits will not run because the container "${this.config.creditsContainerSelector}" does not exist.`
      );
      return;
    }

    this.extractCredits();
    this.displayCredits();
  }

  private shouldRun(): boolean {
    const container = document.querySelector(
      this.config.creditsContainerSelector!
    );
    return !!container;
  }

  private extractCredits() {
    const container = document.querySelector(
      this.config.creditsContainerSelector!
    );
    if (!container) return;

    const authorEl = container.querySelector(this.config.authorSelector!);
    const descriptionEl = container.querySelector(
      this.config.descriptionSelector!
    );

    if (authorEl) {
      this.author = authorEl.textContent?.trim() ?? null;
    }

    if (descriptionEl) {
      this.description = descriptionEl.textContent?.trim() ?? null;
    }

    this.logger.log(
      `Extracted image credits - Author: "${this.author ?? "N/A"}", Description: "${this.description ?? "N/A"}"`
    );
  }

  private displayCredits() {
    if (!this.author && !this.description) return;

    if (this.author) {
      const footerCredits = document.createElement("p");
      footerCredits.className = "footer-image-credits";
      footerCredits.textContent = `Photo © ${this.author}`;
      const insertPoint = document.querySelector(".footer-main-copy");
      insertPoint?.appendChild(footerCredits);
    }
    const fab = document.createElement("div");
    fab.className = "image-credits-fab";

    const hoverCard = document.createElement("div");
    hoverCard.className = "image-credits-hover-card";
    hoverCard.innerHTML = `
    <div class="image-credits-hover-card-content">
      <h5 class="image-credits-author">${this.author ? `&copy; ${this.author}` : ""}</h5>
      <p class="image-credits-description">${this.description ? `${this.description}` : ""}</p>
    </div>
    `;

    const pageBackground = document.querySelector(".page-backgroundImage");
    if (!pageBackground) return;
    pageBackground.appendChild(fab);
    pageBackground.appendChild(hoverCard);

    const MIN_VIEWPORT = 821;
    const HOVER_BOUNDARY = 640;
    let isHovering = false;

    const setHover = (state: boolean) => {
      if (state === isHovering) return;
      isHovering = state;
      hoverCard.classList.toggle("visible", state);
    };

    const onMouseMove = (e: MouseEvent) => {
      setHover(e.clientX >= HOVER_BOUNDARY);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget === null) setHover(false);
    };

    const mq = window.matchMedia(`(min-width: ${MIN_VIEWPORT}px)`);

    const applyViewportState = () => {
      if (mq.matches) {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseout", onMouseOut);
      } else {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseout", onMouseOut);
        setHover(false);
      }
    };

    applyViewportState();
    mq.addEventListener("change", applyViewportState);
  }

}
