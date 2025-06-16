import nodemailer from "nodemailer"

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// Create reusable transporter
function createTransporter(): nodemailer.Transporter | null {
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env

    // For development/testing - log to console if SMTP not configured
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.log("⚠️ SMTP not configured - emails will be logged to console")
      return null
    }

    const config: EmailConfig = {
      host: SMTP_HOST,
      port: Number.parseInt(SMTP_PORT),
      secure: SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    }

    return nodemailer.createTransport(config)
  } catch (error) {
    console.error("Error creating email transporter:", error)
    return null
  }
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const transporter = createTransporter()

    if (!transporter) {
      // Development mode - log email to console
      console.log(`
📧 EMAIL WOULD BE SENT TO: ${to}
📋 SUBJECT: ${subject}
📄 CONTENT: ${html.replace(/<[^>]*>/g, "")}
      `)
      return true
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    }

    console.log("Attempting to send email to:", to)
    const result = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent successfully to ${to}:`, result.messageId)
    return true
  } catch (error) {
    console.error("❌ Email sending failed:", error)
    // In development, still return true to continue the flow
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Development mode: Continuing despite email error")
      return true
    }
    return false
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function getOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
}

// Email templates
export const emailTemplates = {
  signupVerification: (otp: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #16a34a; margin: 0;">Welcome to FarmEase!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin: 20px 0;">
        <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
          Thank you for joining FarmEase! To complete your registration, please use the verification code below:
        </p>
        
        <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <div style="font-size: 32px; font-weight: bold; color: #16a34a; letter-spacing: 4px;">
            ${otp}
          </div>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>Important:</strong> This code expires in 10 minutes and can only be used once.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
        <p>This is an automated message from FarmEase. Please do not reply to this email.</p>
      </div>
    </div>
  `,

  passwordReset: (otp: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #16a34a; margin: 0;">FarmEase Password Reset</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin: 20px 0;">
        <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
          You requested a password reset for your FarmEase account. Use the code below to reset your password:
        </p>
        
        <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <div style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 4px;">
            ${otp}
          </div>
        </div>
        
        <div style="background: #fee2e2; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #991b1b; font-size: 14px;">
            <strong>Security Notice:</strong> This code expires in 10 minutes. If you didn't request this reset, please ignore this email.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
        <p>This is an automated message from FarmEase. Please do not reply to this email.</p>
      </div>
    </div>
  `,
}
