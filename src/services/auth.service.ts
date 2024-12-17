import { API_CONFIG } from "../config/api.config";
import type {
  AuthResult,
  AuthMessageResponse,
} from "../types/eligibility.types";

/**
 * Service responsible for handling authentication-related API interactions.
 * Manages auth message retrieval and token generation for EVM-compatible wallets.
 */
export class AuthService {
  /**
   * Fetches the authentication message that needs to be signed by the user's wallet.
   * This message serves as a challenge for proving wallet ownership.
   *
   * @returns Promise containing the auth message response
   * @throws Will throw if network request fails
   */
  async fetchAuthMessage(): Promise<AuthMessageResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_MESSAGE}`
    );
    return response.json();
  }

  /**
   * Authenticates a user by verifying their signed message and returns an auth token.
   * Implements EVM-specific authentication flow.
   *
   * @param accountAddress - The user's wallet address
   * @param signingDate - ISO timestamp when the message was signed
   * @param signedMessage - The cryptographic signature produced by the wallet
   * @returns Promise resolving to AuthResult if successful, null if authentication fails
   * @throws Will throw if network request fails
   */
  async getAuthToken(
    accountAddress: string,
    signingDate: string,
    signedMessage: string
  ): Promise<AuthResult | null> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: signedMessage,
          signingDate,
          type: "evm",
          wallet: accountAddress,
        }),
      }
    );

    if (!response.ok) return null;
    return response.json();
  }
}
