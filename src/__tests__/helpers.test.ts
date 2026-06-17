import nodemailer from "nodemailer";
import { createOtp, sendMail } from "../utils/helpers";

import {
    jest,
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
} from "@jest/globals";

jest.mock("nodemailer");

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

describe("sendMail", () => {
    let mockSendMail: jest.Mock;

    beforeEach(() => {
        mockSendMail = jest
            .fn()
            .mockResolvedValue({ messageId: "test-message-id" });
        (nodemailer.createTransport as jest.Mock).mockReturnValue({
            sendMail: mockSendMail,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should send an email with correct parameters", async () => {
        const testEmail = "test@example.com";
        const testOtp = "123456";

        await sendMail(testEmail, testOtp);

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            secure: false,
            auth: {
                user: "8b5a68f7d28aac",
                pass: "b2f591523f4028",
            },
        });

        expect(mockSendMail).toHaveBeenCalledWith({
            from: '"TiredDev 30 Days of Code 👻" <tireddev30days@dev.co>',
            to: testEmail,
            subject: "Verify Email Address",
            text: "Welcome to Tireddev Blog Post",
            html: expect.stringContaining(testOtp),
        });
    });
});
