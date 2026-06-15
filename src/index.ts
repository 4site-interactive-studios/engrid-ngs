// import { Options, App, DonationAmount, DonationFrequency, IframeQueue, Ecard } from "@4site/engrid-scripts"; // Uses ENGrid via NPM
import { Options, App, DonationAmount, DonationFrequency, IframeQueue, Ecard } from "../../engrid/packages/scripts";// Uses ENGrid via Visual Studio Workspace

import "./sass/main.scss";
import { customScript } from "./scripts/main";
import DonationLightboxForm from "./scripts/donation-lightbox-form";
import GiftAmounts from "./scripts/gift-amounts";
import GiftDesignationOptIns from "./scripts/gift-designation-opt-ins";
import ImageCredits from "./scripts/image-credits";
import PremiumGifts from "./scripts/premium-gifts";

const options: Options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
  DecimalSeparator: ".",
  ThousandsSeparator: ",",
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  ProgressBar: true,
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  RememberMe: {
    checked: true,
    fieldOptInSelectorTarget:
      "div.en__field--postcode, div.en__field--telephone, div.en__field--email, div.en__field--lastName",
    fieldOptInSelectorTargetLocation: "after",
    fieldClearSelectorTarget:
      "div.en__field--firstName div, div.en__field--email div",
    fieldClearSelectorTargetLocation: "after",
    fieldNames: [
      "supporter.firstName",
      "supporter.lastName",
      "supporter.address1",
      "supporter.address2",
      "supporter.city",
      "supporter.country",
      "supporter.region",
      "supporter.postcode",
      "supporter.emailAddress",
      "supporter.phoneNumber",
    ],
    cookieName: 'ngs-remember',
  },
  onLoad: () => {
    (<any>window).DonationLightboxForm = DonationLightboxForm;
    new DonationLightboxForm(DonationAmount, DonationFrequency, App);
    new GiftDesignationOptIns({
      designations: {
        "Big Cats Initiative": "476017",
        "Last Wild Places": "476084",
        "Plastics Initiative": "476085",
        "Pristine Seas": "476087",
        "Sumatran Rhino": "476088",
        "Elephants": "476089",
        "Photo Ark": "476090",
        "Okavango Delta": "476092",
        "Conservation": "476093",
        "Ocean": "1211164",
        "Land": "1211165",
        "Human History and Culture": "1211166",
        "Human Ingenuity": "1211187",
        "Planetary Health": "1908405",
        "Space": "1908407",
        "Science & Research": "2245319",
        "Exploration & Adventure": "2245322",
        "Travel": "2245323",
        "Photography & Storytelling": "2245324",
        "Education": "2245325"
      },
      fieldName: "giftDesignation",
      parentFieldSelector: "#giftDesignationParent"
    })
    new IframeQueue();
    new ImageCredits();
    new PremiumGifts();
    new GiftAmounts();
    new Ecard();
    customScript(App);
  },
  onResize: () => console.log("Starter Theme Window Resized"),
};

new App(options);
