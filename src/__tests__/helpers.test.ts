import { createOtp } from "../utils/helpers";

describe("createOtp", () => {
  it("should generate a 6-digit numeric OTP", () => {
    const otp = createOtp();

    // Test length is 6
    expect(otp.length).toBe(6);

    // Test it contains only numbers
    expect(/^\d+$/.test(otp)).toBe(true);
  });

  it("should generate different OTPs on multiple calls", () => {
    const otp1 = createOtp();
    const otp2 = createOtp();

    expect(otp1).not.toBe(otp2);
  });

  it("should only contain digits from 0-9", () => {
    const otp = createOtp();
    const digits = otp.split("").map(Number);

    digits.forEach((digit) => {
      expect(digit).toBeGreaterThanOrEqual(0);
      expect(digit).toBeLessThanOrEqual(9);
    });
  });
});
