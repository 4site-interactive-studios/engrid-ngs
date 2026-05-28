/**
 * Premium Gifts
 * @author npgiano
 * Listens for EN premium gift selection and writes the matching product SKU
 * to the transaction.othamt4 field.
 * Runs on DONATION page type when window.EngagingNetworks.premiumGifts has
 * at least one product.
 */
import { ENGrid, EngridLogger } from "@4site/engrid-scripts";

interface ProductVariantOption {
  id: number;
  clientId: number;
  productVariantId: number;
  optionId: number;
  createdOn: number;
}

interface ProductVariant {
  id: number;
  clientId: number;
  productId: number;
  sku: string;
  createdOn: number;
  modifiedOn?: number;
  quantityTotal: number;
  quantitySold: number;
  price: number;
  displayOrder: number;
  name: string;
  productVariantOptions: ProductVariantOption[];
}

interface PremiumGiftsProduct {
  id: number;
  clientId: number;
  name: string;
  description: string;
  status: string;
  variants: ProductVariant[];
  [key: string]: unknown;
}

interface PremiumGiftsData {
  products: PremiumGiftsProduct[];
  [key: string]: unknown;
}

export default class PremiumGifts {
  private logger = new EngridLogger(
    "NGS PremiumGifts",
    "#232323",
    "#f7b500",
    "🎁"
  );
  private productMap: Map<number, PremiumGiftsProduct> = new Map();
  private othamt4Field: HTMLInputElement | null = null;

  constructor() {
    if (!this.shouldRun()) {
      this.logger.log("PremiumGifts will not run on this page.");
      return;
    }
    this.buildProductMap();
    this.ensureField();
    this.addEventListeners();
    this.resolveCurrentSelection();
  }

  private shouldRun(): boolean {
    const products = window.EngagingNetworks?.premiumGifts?.products;
    return (
      ENGrid.getPageType() === "DONATION" &&
      Array.isArray(products) &&
      products.length > 0
    );
  }

  private buildProductMap(): void {
    const products = window.EngagingNetworks?.premiumGifts?.products;
    if (!products) return;
    products.forEach((product: PremiumGiftsProduct) => {
      this.productMap.set(product.id, product);
    });
    this.logger.log(`Built product map with ${this.productMap.size} products.`);
  }

  private ensureField(): void {
    this.othamt4Field = ENGrid.getField(
      "transaction.othamt4"
    ) as HTMLInputElement | null;
    if (!this.othamt4Field) {
      this.othamt4Field = ENGrid.createHiddenInput("transaction.othamt4");
      this.logger.log("Created hidden input for transaction.othamt4.");
    }
  }

  private getSelectedOptionIds(pgContainer: Element): Set<number> {
    const selectedOptions = new Set<number>();
    let selects = pgContainer.querySelectorAll<HTMLSelectElement>(
      ".en__pg__optionType select"
    );
    // EN may move <select> elements out of .en__pg when a dropdown opens.
    // If the scoped search finds nothing, fall back to the whole document.
    if (selects.length === 0) {
      selects = document.querySelectorAll<HTMLSelectElement>(
        ".en__pg__optionType select"
      );
    }
    selects.forEach((select) => {
      const value = parseInt(select.value, 10);
      if (!isNaN(value)) {
        selectedOptions.add(value);
      }
    });
    return selectedOptions;
  }

  private resolveSku(
    productId: number,
    pgContainer: Element
  ): string | null {
    const product = this.productMap.get(productId);
    if (!product || !product.variants || product.variants.length === 0) {
      return null;
    }

    if (product.variants.length === 1 &&
        product.variants[0].productVariantOptions.length === 0) {
      return product.variants[0].sku;
    }

    const selectedOptionIds = this.getSelectedOptionIds(pgContainer);
    for (const variant of product.variants) {
      // Ignore placeholder variants with no options
      if (variant.productVariantOptions.length === 0) {
        continue;
      }
      const variantOptionIds = new Set(
        variant.productVariantOptions.map((o) => o.optionId)
      );
      if (this.setsEqual(variantOptionIds, selectedOptionIds)) {
        return variant.sku;
      }
    }
    return null;
  }

  private setsEqual(a: Set<number>, b: Set<number>): boolean {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }

  private writeSkuField(sku: string | null): void {
    ENGrid.setFieldValue("transaction.othamt4", sku || "");
    this.logger.log(`Wrote SKU to transaction.othamt4: ${sku || "(empty)"}`);
  }

  private resolveCurrentSelection(): void {
    const checkedRadio = document.querySelector<HTMLInputElement>(
      '[name="en__pg"]:checked'
    );
    if (!checkedRadio) {
      this.writeSkuField("");
      return;
    }
    const pgContainer = checkedRadio.closest(".en__pg");
    if (!pgContainer) {
      this.writeSkuField("");
      return;
    }
    const productId = parseInt(checkedRadio.value, 10);
    if (isNaN(productId)) {
      this.writeSkuField("");
      return;
    }
    const sku = this.resolveSku(productId, pgContainer);
    this.writeSkuField(sku);
  }

  private addEventListeners(): void {
    // Listen for premium gift radio changes
    document.addEventListener("change", (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('[name="en__pg"]')) {
        this.resolveCurrentSelection();
      }
    });

    // Listen for clicks on the premium gift card body — EN sets the radio
    // programmatically when clicking the title/description/image, but does
    // not dispatch a change event. Match upstream PremiumGift behavior.
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const pgBody = target.closest(".en__pg__body");
      if (!pgBody) return;

      // If the user clicked directly on the radio input or the select dropdown,
      // let the dedicated change listeners handle it.
      if (
        (target instanceof HTMLInputElement && target.name === "en__pg") ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      const radio = pgBody.querySelector<HTMLInputElement>('[name="en__pg"]');
      if (!radio) return;

      window.setTimeout(() => {
        radio.checked = true;
        this.resolveCurrentSelection();
      }, 100);
    });

    // Listen for variant option changes on any select inside .en__pg__optionType.
    // EN destroys and recreates <select> elements when custom dropdowns open/close
    // because different option pairings are valid (e.g. not all sizes available
    // for all colors). We must wait for EN to finish re-rendering before reading
    // the DOM, so we resolve after a short timeout.
    document.addEventListener("change", (event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".en__pg__optionType")) {
        window.setTimeout(() => {
          this.resolveCurrentSelection();
        }, 100);
      }
    });

    // MutationObserver to clear field when the premium gift block is hidden
    const pgBlock = document.querySelector(".en__component--premiumgiftblock");
    if (pgBlock) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            const target = mutation.target as HTMLElement;
            if (target.style.display === "none") {
              this.writeSkuField("");
              this.logger.log("Premium gift block hidden; cleared SKU field.");
            }
          }
        });
      });
      observer.observe(pgBlock, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  }
}
