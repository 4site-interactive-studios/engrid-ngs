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
  // Find the select element within the wrapper
  // Add your client scripts here
  App.setBodyData("client-js-loading", "finished");
};
