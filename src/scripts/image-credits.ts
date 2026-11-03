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
 *
 * Video credits (optional): add a similar block next to the
 * ".video-container" it refers to (ideally in the same code block):
 * <div class="hide video-credits">
 *   <div class="video-credits-author">Author Name</div>
 *   <div class="video-credits-description">Description</div>
 * </div>
 * While the mouse is over that video, the hover card shows the video credits
 * instead of the background image credits.
 */
import { ENGrid, EngridLogger } from "@4site/engrid-scripts";

export interface ImageCreditsConfig {
  creditsContainerSelector?: string;
  authorSelector?: string;
  descriptionSelector?: string;
  videoCreditsContainerSelector?: string;
  videoAuthorSelector?: string;
  videoDescriptionSelector?: string;
  videoSelector?: string;
}

interface Credits {
  author: string | null;
  description: string | null;
}

interface VideoCredits extends Credits {
  video: HTMLElement;
}

const DEFAULT_CONFIG: ImageCreditsConfig = {
  creditsContainerSelector: ".background-image-credits",
  authorSelector: ".background-image-credits-author",
  descriptionSelector: ".background-image-credits-description",
  videoCreditsContainerSelector: ".video-credits",
  videoAuthorSelector: ".video-credits-author",
  videoDescriptionSelector: ".video-credits-description",
  videoSelector: ".video-container",
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
  private videoCredits: VideoCredits[] = [];

  constructor(private incomingConfig: ImageCreditsConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...incomingConfig };

    if (!this.shouldRun()) {
      this.logger.log(
        `ImageCredits will not run because neither "${this.config.creditsContainerSelector}" nor "${this.config.videoCreditsContainerSelector}" exist.`
      );
      return;
    }

    this.extractCredits();
    this.extractVideoCredits();
    this.displayCredits();
  }

  private shouldRun(): boolean {
    return (
      !!document.querySelector(this.config.creditsContainerSelector!) ||
      !!document.querySelector(this.config.videoCreditsContainerSelector!)
    );
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

  private extractVideoCredits() {
    const blocks = document.querySelectorAll(
      this.config.videoCreditsContainerSelector!
    );

    blocks.forEach((block) => {
      const author =
        block
          .querySelector(this.config.videoAuthorSelector!)
          ?.textContent?.trim() || null;
      const description =
        block
          .querySelector(this.config.videoDescriptionSelector!)
          ?.textContent?.trim() || null;
      if (!author && !description) return;

      const video = this.findVideoFor(block);
      if (!video) {
        this.logger.log(
          `Video credits found, but no "${this.config.videoSelector}" near them.`
        );
        return;
      }

      this.videoCredits.push({ video, author, description });
      this.logger.log(
        `Extracted video credits - Author: "${author ?? "N/A"}", Description: "${description ?? "N/A"}"`
      );
    });
  }

  // The closest video to the credits block: same code block first, then
  // walking up its ancestors.
  private findVideoFor(block: Element): HTMLElement | null {
    let parent = block.parentElement;
    while (parent) {
      const video = parent.querySelector<HTMLElement>(
        this.config.videoSelector!
      );
      if (video) return video;
      parent = parent.parentElement;
    }
    return null;
  }

  private addFooterCredits(text: string, className: string) {
    const footerCredits = document.createElement("p");
    footerCredits.className = className;
    footerCredits.textContent = text;
    const insertPoint = document.querySelector(".footer-main-copy");
    insertPoint?.appendChild(footerCredits);
  }

  private displayCredits() {
    const imageCredits: Credits | null =
      this.author || this.description
        ? { author: this.author, description: this.description }
        : null;
    if (!imageCredits && !this.videoCredits.length) return;

    if (this.author) {
      this.addFooterCredits(`Photo © ${this.author}`, "footer-image-credits");
    }
    this.videoCredits.forEach(({ author }) => {
      if (!author) return;
      this.addFooterCredits(
        `Video © ${author}`,
        "footer-image-credits footer-video-credits"
      );
    });

    const fab = document.createElement("div");
    fab.className = "image-credits-fab";

    const hoverCard = document.createElement("div");
    hoverCard.className = "image-credits-hover-card";
    hoverCard.innerHTML = `
    <div class="image-credits-hover-card-content">
      <h5 class="image-credits-author"></h5>
      <p class="image-credits-description"></p>
    </div>
    `;
    const authorEl = hoverCard.querySelector(".image-credits-author")!;
    const descriptionEl = hoverCard.querySelector(
      ".image-credits-description"
    )!;

    const renderCard = (credits: Credits, isVideo: boolean) => {
      authorEl.textContent = credits.author ? `© ${credits.author}` : "";
      descriptionEl.textContent = credits.description ?? "";
      hoverCard.classList.toggle("image-credits-hover-card--video", isVideo);
    };
    if (imageCredits) renderCard(imageCredits, false);

    const pageBackground = document.querySelector(".page-backgroundImage");
    if (!pageBackground) return;
    pageBackground.appendChild(fab);
    pageBackground.appendChild(hoverCard);

    const MIN_VIEWPORT = 821;
    const HOVER_BOUNDARY = 640;
    let isInImageArea = false;
    let hoveredVideo: VideoCredits | null = null;
    let shown: Credits | null = null;

    // Video credits win over the background image credits while the mouse is
    // over the video.
    const update = () => {
      const next = hoveredVideo ?? (isInImageArea ? imageCredits : null);
      if (next === shown) return;
      shown = next;
      if (next) renderCard(next, next === hoveredVideo);
      hoverCard.classList.toggle("visible", !!next);
    };

    const videoAt = (x: number, y: number) =>
      this.videoCredits.find(({ video }) => {
        const rect = video.getBoundingClientRect();
        return (
          x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom
        );
      }) ?? null;

    const onMouseMove = (e: MouseEvent) => {
      isInImageArea = e.clientX >= HOVER_BOUNDARY;
      hoveredVideo = videoAt(e.clientX, e.clientY);
      update();
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget !== null) return;
      isInImageArea = false;
      hoveredVideo = null;
      update();
    };

    // Mouse events inside the video iframe never reach this document, so we
    // also listen for the mouse entering/leaving the video container itself.
    const videoListeners = this.videoCredits.map((credits) => ({
      video: credits.video,
      onEnter: () => {
        hoveredVideo = credits;
        update();
      },
      onLeave: (e: MouseEvent) => {
        if (hoveredVideo === credits) hoveredVideo = null;
        isInImageArea = e.clientX >= HOVER_BOUNDARY;
        update();
      },
    }));

    const mq = window.matchMedia(`(min-width: ${MIN_VIEWPORT}px)`);

    const applyViewportState = () => {
      if (mq.matches) {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseout", onMouseOut);
        videoListeners.forEach(({ video, onEnter, onLeave }) => {
          video.addEventListener("mouseenter", onEnter);
          video.addEventListener("mouseleave", onLeave);
        });
      } else {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseout", onMouseOut);
        videoListeners.forEach(({ video, onEnter, onLeave }) => {
          video.removeEventListener("mouseenter", onEnter);
          video.removeEventListener("mouseleave", onLeave);
        });
        isInImageArea = false;
        hoveredVideo = null;
        update();
      }
    };

    applyViewportState();
    mq.addEventListener("change", applyViewportState);
  }

}
