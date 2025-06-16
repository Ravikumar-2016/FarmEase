import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, userType, timestamp } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Prepare email content
    const emailSubject = `FarmEase Contact Form: ${subject}`
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
          <h1>New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #16a34a;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">User Type:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${userType || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Subject:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Submitted:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(timestamp).toLocaleString()}</td>
            </tr>
          </table>
          
          <h3 style="color: #16a34a; margin-top: 20px;">Message:</h3>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #16a34a; margin: 10px 0;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e5f3ff; border-radius: 5px;">
            <p style="margin: 0; color: #0066cc;">
              <strong>Reply to:</strong> ${email}<br>
              <strong>User Type:</strong> ${userType || "General User"}
            </p>
          </div>
        </div>
        
        <div style="background-color: #16a34a; color: white; padding: 10px; text-align: center; font-size: 12px;">
          FarmEase Contact Form - Automated Message
        </div>
      </div>
    `

    // Send email to admin
    await sendEmail(
      process.env.ADMIN_EMAIL || "farmeaseinfo@gmail.com",
      emailSubject,
      emailBody
    )

    // Send confirmation email to user
    const confirmationSubject = "Thank you for contacting FarmEase"
    const confirmationBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
          <h1>Thank You for Contacting FarmEase!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${name},</p>
          
          <p>Thank you for reaching out to FarmEase. We have received your message and will respond within 24 hours.</p>
          
          <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #16a34a; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #16a34a;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
          </div>
          
          <p>In the meantime, you can:</p>
          <ul>
            <li>Explore our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/features" style="color: #16a34a;">platform features</a></li>
            <li>Learn more <a href="${process.env.NEXT_PUBLIC_BASE_URL}/about" style="color: #16a34a;">about FarmEase</a></li>
            <li>Check out our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="color: #16a34a;">dashboard</a></li>
          </ul>
          
          <p>Best regards,<br>The FarmEase Team</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>This is an automated confirmation email. Please do not reply to this email.</p>
          <p>For urgent matters, contact us directly at farmeaseinfo@gmail.com</p>
        </div>
      </div>
    `

    await sendEmail(
      email,
      confirmationSubject,
      confirmationBody
    )

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
