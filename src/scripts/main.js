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

  const isSpanish =
    document.querySelector("label[for='en__field_supporter_emailAddress']") &&
    document.querySelector("label[for='en__field_supporter_emailAddress']")
      .textContent === "Correo electrónico";

  // On eCard pages, change the label of the "Add contact" button
  const ecardAddRecipeintButton = document.querySelector(
    ".en__ecarditems__addrecipient"
  );

  if (ecardAddRecipeintButton) {
    ecardAddRecipeintButton.textContent = isSpanish
      ? "Agrega destinatario"
      : "Add recipient";
  }

  // On eCard pages, add a label to the recipients list
  const ecardRecipientList = document.querySelector(
    ".en__ecardrecipients__list"
  );

  if (ecardRecipientList) {
    const label = document.createElement("h2");
    label.textContent = isSpanish ? "Lista de contactos" : "Recipients list";
    label.id = "recipients-list-label";
    label.setAttribute("for", "en__ecardrecipients__list");
    ecardRecipientList.setAttribute("aria-labelledby", "recipients-list-label");

    ecardRecipientList.parentNode.insertBefore(label, ecardRecipientList);
  }

  // On eCard pages, move the "Add recipients" button out of its current wrapper and add supporting button classes
  const addRecipientButton = document.querySelector(
    ".en__ecarditems__addrecipient"
  );
  const emailDiv = document.querySelector(".en__ecardrecipients__email");

  if (addRecipientButton && emailDiv) {
    addRecipientButton.classList.add("button");
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("en__ecardrecipients__button");

    // Remove the button from its current position
    addRecipientButton.parentNode.removeChild(addRecipientButton);

    // Wrap the button with the new div
    wrapperDiv.appendChild(addRecipientButton);

    // Insert the wrapped button after the email div
    emailDiv.parentNode.insertBefore(wrapperDiv, emailDiv.nextSibling);
  }

  // On eCard pages, when the "Add recipients" button is clicked, remove any values in the Add Recipient Name and Email field
  // Hide the recipients list header and list until there are recipients added
  // On eCard pages, simulate full field errors on the eCard Recipient name field and email field
  const addRecipientButton2 = document.querySelector(
    ".en__ecarditems__addrecipient"
  );
  const nameInput = document.querySelector(".en__ecardrecipients__name input");
  const emailInput = document.querySelector(
    ".en__ecardrecipients__email input"
  );
  const recipientsList = document.querySelector(".en__ecardrecipients__list");
  const recipientsListLabel = document.querySelector("#recipients-list-label");
  const emailParent = document.querySelector(".en__ecardrecipients__email");
  const nameParent = document.querySelector(".en__ecardrecipients__name");

  if (
    addRecipientButton2 &&
    nameInput &&
    emailInput &&
    recipientsList &&
    recipientsListLabel &&
    emailParent &&
    nameParent
  ) {
    let previousRecipientCount = document.querySelectorAll(
      ".en__ecardrecipients__recipient .ecardrecipient__email"
    ).length;

    const clearInputs = () => {
      let currentRecipientCount = document.querySelectorAll(
        ".en__ecardrecipients__recipient .ecardrecipient__email"
      ).length;

      if (currentRecipientCount > previousRecipientCount) {
        nameInput.value = "";
        emailInput.value = "";
      }

      previousRecipientCount = currentRecipientCount;
    };

    addRecipientButton2.addEventListener("click", clearInputs);
    addRecipientButton2.addEventListener("touchend", clearInputs);
    addRecipientButton2.addEventListener("keydown", clearInputs);

    const toggleElementsVisibility = () => {
      const displayValue = recipientsList.innerHTML.trim() ? "block" : "none";
      recipientsListLabel.style.display = displayValue;
      recipientsList.style.display = displayValue;
    };

    // Initially set the visibility of the label and the recipients list
    toggleElementsVisibility();

    // Create a MutationObserver instance to monitor changes in the content of the recipients list
    const listObserver = new MutationObserver(toggleElementsVisibility);

    // Start observing the recipients list for changes in its content
    listObserver.observe(recipientsList, { childList: true, subtree: true });

    const toggleValidationClass = (element, parent) => (mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          if (element.classList.contains("invalid")) {
            parent.classList.add("en__field--validationFailed");
          } else {
            parent.classList.remove("en__field--validationFailed");
          }
        }
      }
    };

    // Create MutationObserver instances to monitor changes in the input's attributes
    const inputObserver1 = new MutationObserver(
      toggleValidationClass(emailInput, emailParent)
    );
    const inputObserver2 = new MutationObserver(
      toggleValidationClass(nameInput, nameParent)
    );

    // Start observing the inputs for changes in their attributes
    inputObserver1.observe(emailInput, { attributes: true });
    inputObserver2.observe(nameInput, { attributes: true });
  }

  // Check if '.en__ecarditems__preview' exists in the page
  const eCardPreview = document.querySelector(".en__ecarditems__preview");

  if (eCardPreview) {
    // Add 'data-ecard-preview' attribute to the body
    document.body.setAttribute("data-ecard-preview", "");

    // Function to set 'data-ecard-preview' value based on '.preview--show' class
    const setEcardPreviewAttribute = () => {
      if (eCardPreview.classList.contains("preview--show")) {
        document.body.setAttribute("data-ecard-preview", "visible");
      } else {
        document.body.setAttribute("data-ecard-preview", "hidden");
      }
    };

    // Initial setting of 'data-ecard-preview' value
    setEcardPreviewAttribute();

    // Create a MutationObserver instance to monitor changes in '.en__ecarditems__preview' class
    const ecardPreviewObserver = new MutationObserver(setEcardPreviewAttribute);

    // Start observing '.en__ecarditems__preview' for changes in its class
    ecardPreviewObserver.observe(eCardPreview, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // If the page has no page background image (data-engrid-no-backgroundimage) and is a 1 col layout, switch layout to centercenter1col
  if (document.body.getAttribute("data-engrid-layout").indexOf("1col") !== -1 && document.body.hasAttribute("data-engrid-no-page-backgroundimage")) {
    document.body.setAttribute("data-engrid-layout", "centercenter1col");
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
