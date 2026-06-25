import { ENGrid } from "@4site/engrid-scripts";

export const customScript = function (App) {
  console.log("ENGrid client scripts are executing");
  // Find "give-by-select-wrapper" -- Code block character limits meant we couldn't add the image URLs in the HTML, so we have to do it here.
  const giveBySelectWrapper = document.querySelector(".give-by-select-wrapper");
  if (giveBySelectWrapper) {
    // Find apple-pay class, set data-src to the apple pay image, and add the class "apple-pay-image"
    const applePayElement = giveBySelectWrapper.querySelector("img.apple-pay");
    if (applePayElement) {
      applePayElement.setAttribute(
        "src",
        "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-applepay.svg?v=1780423619000"
      );
    }
    const gPayElement = giveBySelectWrapper.querySelector("img.google-pay");
    if (gPayElement) {
      gPayElement.setAttribute(
        "src",
        "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-gpay.svg?v=1780423619000"
      );
    }
    const payPalWhiteElement =
      giveBySelectWrapper.querySelectorAll("img.paypal-w");
    for (const element of payPalWhiteElement) {
      element.setAttribute(
        "src",
        "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-paypal-w.svg?v=1780423619000"
      );
    }
    const payPalBlackElement =
      giveBySelectWrapper.querySelectorAll("img.paypal-b");
    for (const element of payPalBlackElement) {
      element.setAttribute(
        "src",
        "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-paypal-b.svg?v=1780423619000"
      );
    }
    const dafPayElement = giveBySelectWrapper.querySelector("img.daf");
    if (dafPayElement) {
      dafPayElement.setAttribute(
        "src",
        "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-daf.svg?v=1780423619000"
      );
    }
    const bankElement = giveBySelectWrapper.querySelector("img.bank");
    if (bankElement) {
      bankElement.setAttribute(
        "src",
        "https://aaf18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-bank.svg?v=1780423619000"
      );
    }
    const venmoElement = giveBySelectWrapper.querySelector("img.venmo");
    if (venmoElement) {
      venmoElement.setAttribute(
        "src",
        "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-venmo.svg?v=1780423619000"
      );
    }
    const cardsElement = giveBySelectWrapper.querySelector(
      "img.credit-card-logos"
    );
    if (cardsElement) {
      cardsElement.setAttribute(
        "src",
        "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2184/payment-type-cards.png?v=1780423619000"
      );
    }
  }

  /**
   * Function to rearrange eCard related elements on the page.
   * Moves .en__ecarditems__action to come after .en__ecardmessage and
   * moves .en__ecardrecipients__futureDelivery to come after .en__ecardrecipients.
   */
  function rearrangeEcardElements() {
    // Get the elements
    const ecardItemsAction = document.querySelector(".en__ecarditems__action");
    const ecardMessage = document.querySelector(".en__ecardmessage");
    const ecardRecipientsFutureDelivery = document.querySelector(
      ".en__ecardrecipients__futureDelivery"
    );
    const ecardRecipients = document.querySelector(".en__ecardrecipients");

    // Move .en__ecarditems__action so it comes after .en__ecardmessage
    if (ecardItemsAction && ecardMessage) {
      ecardMessage.insertAdjacentElement("afterend", ecardItemsAction);
    }

    // Move .en__ecardrecipients__futureDelivery so it comes after .en__ecardrecipients
    if (ecardRecipientsFutureDelivery && ecardRecipients) {
      ecardRecipients.insertAdjacentElement(
        "afterend",
        ecardRecipientsFutureDelivery
      );
    }
  }

  // Call the function
  if (ENGrid.getPageType() === "ECARD") {
    rearrangeEcardElements();
  }

  // Find the select element within the wrapper
  // Add your client scripts here
  App.setBodyData("client-js-loading", "finished");

  // Mark the page as "animation-loaded" after the mobile background-image intro
  // animation (2.3s) has had time to play out. The animation CSS is gated on the
  // absence of [data-engrid-animation-loaded], so this prevents it from replaying
  // when the viewport crosses the mobile breakpoint (e.g. 641px -> 640px).
  window.setTimeout(() => {
    App.setBodyData("animation-loaded", "true");
  }, 3000);
};
