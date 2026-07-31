import { Options, App, DonationAmount, DonationFrequency, IframeQueue, Ecard, ApplePay } from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import { Options, App, DonationAmount, DonationFrequency, IframeQueue, Ecard, ApplePay } from "../../engrid/packages/scripts";// Uses ENGrid via Visual Studio Workspace

import "./sass/main.scss";
import { customScript } from "./scripts/main";
import DonationLightboxForm from "./scripts/donation-lightbox-form";
import GiftAmounts from "./scripts/gift-amounts";
import GiftDesignationOptIns from "./scripts/gift-designation-opt-ins";
import ImageCredits from "./scripts/image-credits";
import PremiumGifts from "./scripts/premium-gifts";
import VantivApplePay from "./scripts/vantiv-apple-pay";

const options: Options = {
  applePay: true,
  UseBodyBannerImageAsBackground: true,
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
    new GiftDesignationOptIns("transaction.othamt1")
    new IframeQueue();
    new ImageCredits();
    new PremiumGifts();
    new GiftAmounts();
    new Ecard();
    new VantivApplePay(ApplePay.getInstance(), DonationAmount.getInstance());
    customScript(App);
  },
  onResize: () => console.log("Starter Theme Window Resized"),
};

new App(options);
