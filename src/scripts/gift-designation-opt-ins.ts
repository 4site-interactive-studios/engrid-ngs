/**
 * Gift Designation Opt-Ins
 * @author npgiano
 * @date 13-04-2026
 * Works in tandem with "Donation: Form: Designation Selection" code block
 * It dynamically populates the gift designation select field with options
 * from the configuration object and creates a hidden input to opt-in the supporter
 * to the selected designation.
 */
import { ENGrid, EngridLogger, IframeQueue } from "@4site/engrid-scripts";
import * as cookie from "@4site/engrid-scripts/dist/cookie";
import { resolveSupporterEmail } from "./helpers/resolve-supporter-email";

export interface GiftDesignationOptInsConfig {
  designations?: {
    [key: string]: string
  },
  fieldName?: string
  parentFieldSelector?: string
}

const DEFAULT_CONFIG: GiftDesignationOptInsConfig = {
  designations: {},
  fieldName: "giftDesignation",
  parentFieldSelector: "#giftDesignationParent"
}

export default class GiftDesignationOptIns {
  private logger = new EngridLogger("NGS GiftDesignationOptIns", "#FCAB23", "dodgerblue", "🧧")
  private config: GiftDesignationOptInsConfig;
  private selectField: HTMLSelectElement | null = null;
  private other1Field: HTMLInputElement | null = null;

  constructor(private incomingConfig: GiftDesignationOptInsConfig) {
    this.config = { ...DEFAULT_CONFIG, ...incomingConfig }
    if (ENGrid.isThankYouPage()) {
      // Check what gift designation the supporter selected on the donation form
      const selectedValue = cookie.get('designation') ?? false
      if (selectedValue && selectedValue !== "") {
        const queue = IframeQueue.getInstance();
        resolveSupporterEmail(this.logger).then((email) => {
          if (email) {
            queue.enqueue({
              url: 'https://give.nationalgeographic.org/page/192242/data/1',
              fields: { [`supporter.questions.${selectedValue}`]: 'Y', 'supporter.emailAddress': email },
              onComplete: () => {
                this.logger.log(`Successfully sent gift designation opt-in for designation ID ${selectedValue}.`)
              }
            });
            queue.process();
          } else {
            this.logger.error(`Could not resolve supporter email address, so gift designation opt-in for designation ID ${selectedValue} was not sent.`)
          }
        });
        ENGrid.setBodyData('designation', 'y')
      } else {
        ENGrid.setBodyData('designation', 'n')
      }
    } else if (this.shouldRun()) {
      ENGrid.createHiddenInput('supporter.questions.476085', 'Y')
      this.other1Field = ENGrid.createHiddenInput("transaction.othamt1")
      this.populateDesignations()
      this.addListeners()
    } else {
      this.logger.log(`GiftDesignationOptIns will not run because either the field "${this.config.fieldName}" does not exist or no designations are configured.`)
      this.hideField()
    }
    cookie.remove('designation')
  }

  private shouldRun() {
    this.selectField = ENGrid.getField(this.config.fieldName!) as HTMLSelectElement | null
    return !!this.selectField && Object.keys(this.config.designations!).length > 0
  }

  private populateDesignations() {
    if (!this.selectField) return
    const selectOption = document.createElement("option")
    selectOption.value = ""
    selectOption.textContent = "Select a designation"
    this.selectField.appendChild(selectOption)
    Object.keys(this.config.designations!).forEach((value: string) => {
      const option = document.createElement("option")
      option.value = this.config.designations![value]
      option.textContent = value
      this.selectField!.appendChild(option)
    })
    this.logger.log(`Populated gift designation field: ${this.config.fieldName} with ${Object.keys(this.config.designations!).length} options.`)
  }

  private addListeners() {
    this.selectField?.addEventListener("change", (event) => {
      const selectedValue = (event.target as HTMLSelectElement).value
      this.other1Field!.value = (event.target as HTMLSelectElement).selectedOptions[0].textContent || ""
      cookie.set('designation', selectedValue)
      this.logger.log(`Supporter selected gift designation with ID ${selectedValue} and name "${this.other1Field!.value}".`)
    })
  }

  private hideField() {
    const field = document.querySelector(this.config.parentFieldSelector!) as HTMLElement | null
    if (field) {
      field.classList.add("i1-hide")
    }
    this.logger.log(`Hiding gift designation field: ${this.config.parentFieldSelector}`)
  }

}