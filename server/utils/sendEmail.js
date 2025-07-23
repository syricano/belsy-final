import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: 'info.belsy@gmail.com',
    subject,
    html,
  };

  await sgMail.send(msg);
};

export default sendEmail;
