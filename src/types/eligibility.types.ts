export interface EligibilityResult {
  readonly total: number;
  readonly totalUnclaimed: number;
}

export interface AuthResult {
  readonly isValid: boolean;
  readonly token: string;
}

export interface AuthMessageResponse {
  readonly message: string;
  readonly signingDate: string;
}
