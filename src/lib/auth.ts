import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/src/lib/prisma";
import { Resend } from "resend";
import { admin } from "better-auth/plugins";
import ForgotPasswordEmail from "./emails/reset-password";
import VerifyEmail from "./emails/verfify-email";
export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    expiresIn: 600,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: "no-reply@schoolappproject.shop",
        to: user.email,
        subject: "Verifier votre Email",
        react: VerifyEmail({
          username: user.name,
          verifyUrl: url,
        }),
      });
    },
  },
  plugins: [admin()],
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "no-reply@schoolappproject.shop",
        to: user.email,
        subject: "Reset Your password",
        react: ForgotPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      });
    },
  },
});
