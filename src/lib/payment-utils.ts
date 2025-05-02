
/**
 * Formats a string for generating a PromptPay QR code
 * 
 * @param promptPayID - The PromptPay ID (national ID, phone number, or e-wallet ID)
 * @param amount - The payment amount
 * @returns The formatted string for QR code generation
 */
export function formatPromptPayQRCode(promptPayID: string, amount: number): string {
  // Simple implementation - in production, should implement the full EMV QR Code spec
  // This is a placeholder - the actual EMV QR Code specification is more complex
  return `promptpay://${promptPayID}/${amount.toFixed(2)}`;
}

/**
 * Validates a payment reference (e.g., bank transfer reference)
 * 
 * @param reference - The payment reference to validate
 * @returns True if the reference appears valid
 */
export function validatePaymentReference(reference: string): boolean {
  // Simple validation - in production, implement proper validation logic
  return reference.length >= 6 && /^[a-zA-Z0-9]+$/.test(reference);
}

/**
 * Formats a currency value in Thai Baht
 * 
 * @param amount - The amount to format
 * @returns Formatted amount string
 */
export function formatThaiCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2
  }).format(amount);
}
