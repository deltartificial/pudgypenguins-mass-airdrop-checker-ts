import { createWalletClient, http } from "viem";
import { mainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { AuthService } from "./auth.service";
import { EligibilityService } from "./eligibility.service";

/**
 * Service responsible for checking wallet eligibility using private keys.
 * Implements authentication flow and eligibility verification.
 */
export class CheckerService {
  private walletClient = createWalletClient({
    chain: mainnet,
    transport: http(),
  });
  private authService = new AuthService();
  private eligibilityService = new EligibilityService();

  /**
   * Processes a single account by:
   * 1. Converting private key to account
   * 2. Authenticating via message signing
   * 3. Checking eligibility status
   *
   * @param pk - Private key string
   * @param index - Current processing index
   * @param total - Total number of keys to process
   * @returns Eligibility result or null if failed
   */
  private async processAccount(pk: string, index: number, total: number) {
    try {
      console.log(`\nChecking key ${index + 1}/${total}...`);
      const formattedPk = pk.startsWith("0x") ? pk : `0x${pk}`;
      const account = privateKeyToAccount(formattedPk as `0x${string}`);

      // Rate limiting protection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const messageData = await this.authService.fetchAuthMessage();
      const signature = await this.walletClient.signMessage({
        account,
        message: messageData.message,
      });

      const authResult = await this.authService.getAuthToken(
        account.address,
        messageData.signingDate,
        signature
      );
      if (!authResult?.token) return null;

      const eligibilityResult =
        await this.eligibilityService.checkAccountEligibility(account.address);
      if (eligibilityResult) {
        console.log(
          `${account.address} - Total: ${eligibilityResult.total} - TotalUnclaimed: ${eligibilityResult.totalUnclaimed}`
        );
        return eligibilityResult;
      }
    } catch (error) {
      console.error(`Error processing private key:`, error);
    }
    return null;
  }

  /**
   * Batch processes multiple private keys to check eligibility.
   * Executes checks in parallel and aggregates results.
   *
   * @param privateKeys - Array of private keys to check
   */
  async checkAllEligibility(privateKeys: string[]) {
    console.log(`Starting to check ${privateKeys.length} private keys...`);
    let totalAmount = 0;
    let totalUnclaimed = 0;

    const results = await Promise.all(
      privateKeys.map((pk, index) =>
        this.processAccount(pk, index, privateKeys.length)
      )
    );

    results.forEach((result, index) => {
      if (result) {
        totalAmount += Number(result.total) || 0;
        totalUnclaimed += Number(result.totalUnclaimed) || 0;
      }
      console.log(
        `Progress: ${index + 1}/${privateKeys.length} keys processed`
      );
    });

    this.eligibilityService.printSummary(
      results.length,
      totalAmount,
      totalUnclaimed
    );
  }
}
