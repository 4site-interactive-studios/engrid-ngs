import { ENGrid, EngridLogger } from "@4site/engrid-scripts";
declare global {
  interface Window {
    EngagingNetworks: any;
  }
}
/**
 * Resolve the supporter's email address, trying sources in this
 * order:
 *
 *   1. `ENGrid.getFieldValue("supporter.emailAddress")` — synchronous
 *      read of the supporter email form field. On chained pages
 *      (e.g. advocacy Thank You → donation page 1 via `?chain`)
 *      EN pre-fills supporter fields on the next page, so the
 *      email is right there with no XHR required. This is the
 *      hot path for the chained-page scenario.
 *
 *   2. EN's async `enjs.getPageData` API — callback-based, reads
 *      the supporter from EN's in-page data layer (the `/pagedata`
 *      response). Used on pages where the email isn't echoed onto
 *      a form field (typical TY page after a standalone donation).
 *      Chosen over the synchronous `enjs.getSupporterData` because
 *      that one's underlying XHR is set with `async: false`, which
 *      modern browsers (Chrome, Firefox) routinely block or abort
 *      silently in cross-origin / iframe contexts. When that
 *      happens EN caches an empty result and every later call
 *      returns the empty cache. `getPageData` is the well-behaved
 *      callback-based alternative on the same data source — it
 *      caches into `enjs._pageDataResponse` and replays for
 *      subsequent callers, so it's reliable and idempotent.
 *
 * The validation regex is intentionally lenient — EN already
 * validated the email on submission, so we're just guarding
 * against empty strings or obviously malformed values. Resolves
 * to null after a 30s timeout if EN's framework isn't loaded or
 * the /pagedata call hangs.
 */
export function resolveSupporterEmail(logger?: EngridLogger): Promise<string | null> {
  return new Promise((resolve) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const maxWaitMs = 30000;
    let settled = false;

    const finish = (email: string | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve(email);
    };

    const timeoutId = window.setTimeout(() => {
      logger?.error(
        `resolveSupporterEmail: timed out after ${maxWaitMs}ms ` +
        `waiting for EN's getPageData callback.`
      );
      finish(null);
    }, maxWaitMs);

    // Source 1: supporter email field on the current page (synchronous).
    const fromField = ENGrid.getFieldValue("supporter.emailAddress");
    if (typeof fromField === "string" && emailRegex.test(fromField)) {
      finish(fromField);
      return;
    }

    // Source 2: EN's async getPageData (XHR-backed, cached).
    if (
      !ENGrid.checkNested(
        window.EngagingNetworks,
        "require",
        "_defined",
        "enjs",
        "getPageData"
      )
    ) {
      finish(null);
      return;
    }

    try {
      window.EngagingNetworks.require._defined.enjs.getPageData(
        (data: { emailAddress?: unknown } | undefined) => {
          const email = data?.emailAddress;
          if (typeof email === "string" && emailRegex.test(email)) {
            finish(email);
          } else {
            finish(null);
          }
        },
        (_err: unknown) => {
          finish(null);
        }
      );
    } catch {
      finish(null);
    }
  });
}
