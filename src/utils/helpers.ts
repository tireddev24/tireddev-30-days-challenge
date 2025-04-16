export function createOtp(): string {
  const otp: string = Math.floor(12345 + Math.random() * 9).toString();
  return otp;
}
