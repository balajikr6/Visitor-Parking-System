const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define email options
    const mailOptions = {
        from: `Visitor Parking System <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${options.email}`);
    } catch (error) {
        logger.error('Error sending email:', error);
        // Don't throw error to avoid breaking the flow if email fails
    }
};

module.exports = sendEmail;
