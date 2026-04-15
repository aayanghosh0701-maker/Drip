const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"AURA Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your AURA account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 8px;">
        <h1 style="color: #e8ff3b; font-size: 2rem; letter-spacing: 0.1em;">AURA</h1>
        <h2 style="margin-top: 24px;">Hey ${name}, verify your email!</h2>
        <p style="color: #888; margin: 16px 0;">Click the button below to verify your email address and activate your account.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #e8ff3b; color: #0a0a0a; padding: 14px 32px; border-radius: 4px; font-weight: 700; text-decoration: none; margin: 24px 0; letter-spacing: 0.1em; text-transform: uppercase;">
          Verify Email
        </a>
        <p style="color: #555; font-size: 12px; margin-top: 32px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
};

exports.sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"AURA Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your AURA password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f0; padding: 40px; border-radius: 8px;">
        <h1 style="color: #e8ff3b; font-size: 2rem; letter-spacing: 0.1em;">AURA</h1>
        <h2 style="margin-top: 24px;">Reset your password</h2>
        <p style="color: #888; margin: 16px 0;">Hey ${name}, click the button below to reset your password.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #e8ff3b; color: #0a0a0a; padding: 14px 32px; border-radius: 4px; font-weight: 700; text-decoration: none; margin: 24px 0; letter-spacing: 0.1em; text-transform: uppercase;">
          Reset Password
        </a>
        <p style="color: #555; font-size: 12px; margin-top: 32px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};
