import { Options, App, DonationAmount, DonationFrequency } from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import { Options, App, DonationAmount, DonationFrequency } from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace

import "./sass/main.scss";
import { customScript } from "./scripts/main";
import DonationLightboxForm from "./scripts/donation-lightbox-form";

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
  onLoad: () => {
    (<any>window).DonationLightboxForm = DonationLightboxForm;
    new DonationLightboxForm(DonationAmount, DonationFrequency, App);
    customScript(App);
  },
  onResize: () => console.log("Starter Theme Window Resized"),
};

new App(options);
