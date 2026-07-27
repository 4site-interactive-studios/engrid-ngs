/**
 * Vantiv Apple Pay
 * Client-specific rules for ENgrid's ApplePay component on the Vantiv
 * gateway. ENgrid core owns the wallet flow (button container, Apple Pay
 * session, billing field copy); this component only enforces NGS policy
 * before the sheet opens.
 * @date 07-27-2026
 */

import { ENGrid } from "@4site/engrid-scripts";
import type { ApplePay, DonationAmount } from "@4site/engrid-scripts";

export default class VantivApplePay {
  private minimumDonationAmount = 5;

  constructor(applePay: ApplePay, donationAmount: DonationAmount) {
    applePay.beforeSession = () => {
      const amount = donationAmount.amount;
      if (amount > 0 && amount < this.minimumDonationAmount) {
        ENGrid.setError(
          ".en__field--donationAmt",
          `The minimum donation amount is $${this.minimumDonationAmount}.`
        );
        return false;
      }
      return true;
    };
  }
}
