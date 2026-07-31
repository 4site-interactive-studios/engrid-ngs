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

export default class GiftDesignationOptIns {
  private logger = new EngridLogger("NGS GiftDesignationOptIns", "#FCAB23", "dodgerblue", "🧧")
  private fundIdFieldName: string
  private fundIdField: HTMLSelectElement | null = null

  constructor(fieldName: string = "transaction.othamt1") {
    this.fundIdFieldName = fieldName
    if (ENGrid.isThankYouPage()) {
      // Check what gift designation the supporter selected on the donation form
      const selectedValue = localStorage.getItem('designation') ?? false
      this.logger.log(`GiftDesignationOptIns is running on the thank you page. Supporter selected gift designation: ${selectedValue}`)
      if (selectedValue && selectedValue !== "") {
        const selectedValueSplit = selectedValue.split("||")
        if (selectedValueSplit.length == 1 || selectedValueSplit[1] === "") {
          this.logger.error(`Gift designation value "${selectedValue}" does not have ID, allowing designation but skipping opt-ins.`)
        } else {
          const queue = IframeQueue.getInstance();
          resolveSupporterEmail(this.logger).then((email) => {
            if (email) {
              queue.enqueue({
                url: 'https://give.nationalgeographic.org/page/192242/data/1',
                fields: { [`supporter.questions.${selectedValueSplit[1]}`]: 'Y', 'supporter.emailAddress': email },
                onComplete: () => {
                  this.logger.log(`Successfully sent gift designation opt-in for designation ID ${selectedValueSplit[1]}.`)
                }
              });
              queue.process();
            } else {
              this.logger.error(`Could not resolve supporter email address, so gift designation opt-in for designation ID ${selectedValueSplit[1]} was not sent.`)
            }
          });
        }
        ENGrid.setBodyData('designation', 'y')
      } else {
        ENGrid.setBodyData('designation', 'n')
      }
      localStorage.removeItem('designation')
    } else if (this.shouldRun()) {
      localStorage.removeItem('designation') // needs to run before handleSelection to ensure that the value is not cleared
      this.populateDesignations()
      this.addListeners()
      if (this.fundIdField!.value) {
        this.handleSelection(this.fundIdField!)
      }
      if (this.fundIdField!.options.length <= 1) {
        this.hideField()
      }
    } else {
      localStorage.removeItem('designation')
      this.logger.log(`GiftDesignationOptIns will not run because either the field "${this.fundIdFieldName}" does not exist or no designations are configured.`)
      this.hideField()
    }
  }

  private shouldRun() {
    this.fundIdField = ENGrid.getField(this.fundIdFieldName) as HTMLSelectElement | null
    return !!this.fundIdField && this.fundIdField.options.length > 0
  }

  private populateDesignations() {
    // Read option text content "Name||ID" and set data-attribute for on each option for it's ID.
    Array.from(this.fundIdField!.options).forEach((option) => {
      const optionText = option.textContent || ""
      const optionValue = option.value || ""
      if (optionText.includes("||")) {
        const [name, id] = optionText.split("||")
        option.textContent = name
        option.setAttribute("data-designation-id", id)
      }
    })
  }

  private handleSelection(field: HTMLSelectElement) {
    const selectedValue = field.value
    const selectedOptionId = field.options[field.selectedIndex].getAttribute("data-designation-id") || ""
    localStorage.setItem('designation', `${selectedValue}||${selectedOptionId}`)
    this.logger.log(`Supporter selected gift designation with ID ${selectedOptionId} and name "${selectedValue}".`)
  }

  private addListeners() {
    this.fundIdField?.addEventListener("change", (event) => {
      this.handleSelection(event.target as HTMLSelectElement)
    })
  }

  private hideField() {
    const field = this.fundIdField?.closest(".en__field") as HTMLElement | null
    if (field) {
      field.classList.add("hide")
    }
    this.logger.log(`Hiding gift designation field: ${this.fundIdFieldName} because it does not exist or has 1 or no options.`)
  }

}