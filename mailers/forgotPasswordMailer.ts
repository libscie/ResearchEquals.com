import { sendEmailWithTemplate } from "../app/postmark"

type ResetPasswordMailer = {
  to: string
  validDuration: number
  token: string
}

export function forgotPasswordMailer({ to, validDuration, token }: ResetPasswordMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/reset-password?token=${token}`

  return {
    async send() {
      await sendEmailWithTemplate(to, "password-reset", {
        valid_duration: validDuration,
        support_url: "support@libscie.org",
        action_url: resetUrl,
      })
    },
  }
}
