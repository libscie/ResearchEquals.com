import { sendEmailWithTemplate } from "../app/postmark"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/reset-password?token=${token}`

  return {
    async send() {
      await sendEmailWithTemplate(to, "password-reset", {
        product_name: "PLACEHOLDER",
        support_url: "info@libscie.org",
        action_url: resetUrl,
      })
    },
  }
}
