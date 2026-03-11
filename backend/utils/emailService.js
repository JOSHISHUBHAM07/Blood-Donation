const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASS || 'password',
    },
});

const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"Life Flow Blood Donation" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`Email Error: ${error.message}`);
        
        return false;
    }
};



const generateWelcomeEmail = (name) => {
    return {
        subject: 'Welcome to Life Flow - Save Lives Today!',
        html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #f43f5e; padding: 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Life Flow</h1>
                </div>
                <div style="padding: 24px; color: #374151;">
                    <h2 style="color: #111827;">Hello ${name}, Welcome to Life Flow!</h2>
                    <p style="font-size: 16px; line-height: 1.5;">Thank you for registering on our platform. Whether you're here to donate blood or request it for a loved one, your presence makes our community stronger.</p>
                    <p style="font-size: 16px; line-height: 1.5;">Together, we can ensure that every critical blood request is met with a willing donor.</p>
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="http://localhost:5173/login" style="background-color: #f43f5e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
                    </div>
                </div>
                <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                    &copy; ${new Date().getFullYear()} Life Flow. All rights reserved.
                </div>
            </div>
        `
    };
};

const generateUrgentRequestEmail = (hospital, bloodGroup, units, patientName) => {
    return {
        subject: `URGENT: ${bloodGroup} Blood Needed at ${hospital}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #ef4444; padding: 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">URGENT BLOOD REQUEST</h1>
                </div>
                <div style="padding: 24px; color: #374151;">
                    <h2 style="color: #b91c1c; text-align: center; font-size: 32px; margin-top: 0;">${bloodGroup}</h2>
                    <p style="font-size: 16px; line-height: 1.5;">A critical patient (${patientName}) is in urgent need of <strong>${units} unit(s)</strong> of <strong>${bloodGroup}</strong> blood.</p>
                    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0;">
                        <strong>Hospital:</strong> ${hospital}
                    </div>
                    <p style="font-size: 16px; line-height: 1.5;">Since you are registered as a ${bloodGroup} donor, you might be able to help. Please log in to your dashboard to view the request and accept it if you are available to donate.</p>
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="http://localhost:5173/login" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View Request</a>
                    </div>
                </div>
            </div>
        `
    };
};

const generateStatusUpdateEmail = (status, hospital, bloodGroup) => {
    const isApproved = status === 'Approved' || status === 'Donor Assigned';
    const color = isApproved ? '#10b981' : (status === 'Pending' ? '#f59e0b' : '#6b7280');

    return {
        subject: `Update on your Blood Request: ${status}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                <div style="background-color: ${color}; padding: 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Request Status Update</h1>
                </div>
                <div style="padding: 24px; color: #374151;">
                    <h2 style="color: #111827;">Your blood request status has changed.</h2>
                    <p style="font-size: 16px; line-height: 1.5;">The status for your recent request for <strong>${bloodGroup}</strong> at <strong>${hospital}</strong> has been updated to:</p>
                    <div style="text-align: center; padding: 16px; background-color: #f9fafb; border-radius: 8px; margin: 24px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: ${color};">${status}</span>
                    </div>
                    <p style="font-size: 16px; line-height: 1.5;">Please log in to your dashboard for more details or further instructions.</p>
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="http://localhost:5173/login" style="background-color: ${color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
                    </div>
                </div>
            </div>
        `
    };
};

module.exports = {
    sendEmail,
    generateWelcomeEmail,
    generateUrgentRequestEmail,
    generateStatusUpdateEmail
};
