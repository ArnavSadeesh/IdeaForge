import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password or email password
  },
});

// Function to send hackathon code to host
export const sendHackathonCodeEmail = async (hostEmail, hostName, hackathonName, hackathonCode) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hostEmail,
      subject: `Your Hackathon Code - ${hackathonName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">🎉 Welcome to IdeaForge!</h1>
            <p style="color: #666; font-size: 18px;">Your hackathon has been successfully created</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${hostName}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Congratulations! Your hackathon <strong>"${hackathonName}"</strong> has been successfully registered on IdeaForge.
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; font-size: 18px;">Your Hackathon Code</h3>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 3px; margin: 10px 0;">
                ${hackathonCode}
              </div>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
                Share this code with participants to join your hackathon
              </p>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">📋 Important Information:</h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                <li>Keep this code secure and share it only with intended participants</li>
                <li>Participants will need this code to join your hackathon</li>
                <li>You can find this code anytime in your dashboard</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin: 20px 0;">
              Ready to get started? Log in to your dashboard to manage your hackathon, add themes, and see participant registrations.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8001'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
            <p>Happy hacking! 🚀</p>
            <p>The IdeaForge Team</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendHackathonCodeEmail };