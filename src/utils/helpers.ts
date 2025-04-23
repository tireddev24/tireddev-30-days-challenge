import nodemailer from "nodemailer";

export function createOtp(): string {
  const characters = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }
  return otp;
}

export const sendMail = (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: "8b5a68f7d28aac",
      pass: "b2f591523f4028",
    },
  });

  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"TiredDev 30 Days of Code 👻" <tireddev30days@dev.co>',
      to: `${email}`,
      subject: "Verify Email Address",
      text: "Welcome to Tireddev Blog Post",
      html: `<pre><h4>Here is your OTP (one time password) </h1><b>${otp}</b></pre>`,
    });

    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
};
