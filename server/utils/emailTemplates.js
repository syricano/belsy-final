// utils/emailTemplates.js

const emailWrapper = (title, content) => `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #fff9f3; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
      <h2 style="color: #004030; font-size: 24px;">${title}</h2>
      <div style="font-size: 16px; line-height: 1.6;">${content}</div>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 14px; color: #888;">If you have questions, contact us at <a href="mailto:support@belsy.com">support@belsy.com</a></p>
    </div>
  </div>
`;

// --- User Actions ---
export const registrationEmail = (name) =>
  emailWrapper(`Welcome to Belsy, ${name}!`, `
    <p>Your account has been created successfully. We're excited to have you dine with us.</p>
    <p>You can now make reservations, leave feedback, and receive updates from us.</p>
  `);

export const profileUpdatedEmail = (name) =>
  emailWrapper(`Profile Updated`, `
    <p>Hello ${name},</p>
    <p>This is a confirmation that your profile information has been updated.</p>
    <p>If you didn’t make this change, please contact us immediately.</p>
  `);

// --- Reservation Templates ---
export const reservationCreatedEmail = (name, time) =>
  emailWrapper(`Reservation Received`, `
    <p>Hello ${name || 'Guest'},</p>
    <p>We’ve received your reservation request. It will be reviewed and confirmed shortly.</p>
    <p><strong>Date & Time:</strong> ${new Date(time).toLocaleString()}</p>
    <p>We look forward to seeing you soon!</p>
  `);

export const reservationUpdatedEmail = (name, time) =>
  emailWrapper(`Reservation Updated`, `
    <p>Hello ${name || 'Guest'},</p>
    <p>Your reservation details have been updated.</p>
    <p><strong>New Date & Time:</strong> ${new Date(time).toLocaleString()}</p>
    <p>If this change wasn’t made by you, please reach out to our support team.</p>
  `);

export const reservationCancelledEmail = (name, time) =>
  emailWrapper(`Reservation Cancelled`, `
    <p>Hello ${name || 'Guest'},</p>
    <p>Your reservation scheduled for <strong>${new Date(time).toLocaleString()}</strong> has been <strong>cancelled</strong>.</p>
    <p>If this was accidental, you're welcome to make a new reservation at your convenience.</p>
  `);

export const reservationApprovedEmail = (name, time) =>
  emailWrapper(`Reservation Approved`, `
    <p>Hello ${name || 'Guest'},</p>
    <p>We’re pleased to inform you that your reservation has been <strong>approved</strong>.</p>
    <p><strong>Date & Time:</strong> ${new Date(time).toLocaleString()}</p>
    <p>Please arrive on time. We look forward to welcoming you at Belsy!</p>
  `);

export const reservationDeclinedEmail = (name, time) =>
  emailWrapper(`Reservation Declined`, `
    <p>Hello ${name || 'Guest'},</p>
    <p>Unfortunately, we couldn't accommodate your reservation scheduled for <strong>${new Date(time).toLocaleString()}</strong>.</p>
    <p>Please consider rescheduling or contact us for availability.</p>
  `);

// --- Feedback Templates ---
export const feedbackSubmittedEmail = (name) =>
  emailWrapper(`Thanks for Your Feedback`, `
    <p>Hi ${name || 'Guest'},</p>
    <p>We appreciate your time and effort in sharing feedback with us.</p>
    <p>Your opinion helps us make Belsy a better place for everyone.</p>
  `);

export const feedbackUpdatedEmail = (name) =>
  emailWrapper(`Feedback Updated`, `
    <p>Hi ${name || 'Guest'},</p>
    <p>Your feedback has been successfully updated in our system.</p>
    <p>Thank you for helping us improve continuously.</p>
  `);

export const feedbackDeletedEmail = (name) =>
  emailWrapper(`Feedback Deleted`, `
    <p>Hi ${name || 'Guest'},</p>
    <p>Your feedback has been removed from our system.</p>
    <p>If this was not intended, feel free to submit new feedback anytime.</p>
  `);

export const feedbackRepliedEmail = (name, reply) =>
  emailWrapper(`Reply to Your Feedback`, `
    <p>Hi ${name || 'Guest'},</p>
    <p>Our team has replied to your feedback:</p>
    <blockquote style="border-left: 4px solid #ccc; margin: 15px 0; padding-left: 15px; color: #444;">${reply}</blockquote>
    <p>We hope this addresses your concerns. Thank you again for your message.</p>
  `);
