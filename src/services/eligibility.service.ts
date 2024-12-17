import { API_CONFIG } from "../config/api.config";
import type { EligibilityResult } from "../types/eligibility.types";

/**
 * Service responsible for handling account eligibility checks and reporting
 * Interacts with the eligibility endpoint to verify account status
 */
export class EligibilityService {
  /**
   * Verifies if an account is eligible by querying the eligibility endpoint
   * @param accountAddress - The blockchain address to check eligibility for
   * @returns EligibilityResult if successful, null if request fails
   * @throws May throw network-related errors during fetch
   */
  async checkAccountEligibility(
    accountAddress: string
  ): Promise<EligibilityResult | null> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ELIGIBILITY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([accountAddress]),
      }
    );

    if (!response.ok) return null;
    return response.json();
  }

  /**
   * Outputs a formatted summary of the eligibility check results
   * @param totalProcessed - Total number of keys that were processed
   * @param totalAmount - Total amount available across all accounts
   * @param totalUnclaimed - Total unclaimed amount across all accounts
   */
  printSummary(
    totalProcessed: number,
    totalAmount: number,
    totalUnclaimed: number
  ): void {
    console.log("\n=== Final Summary ===");
    console.log(`Total keys processed: ${totalProcessed}`);
    console.log(`Total amount available: ${totalAmount}`);
    console.log(`Total unclaimed amount: ${totalUnclaimed}`);
  }
}
