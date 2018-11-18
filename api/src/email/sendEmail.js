const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default (message) => {
  console.log('sending email!');
  return new Promise((resolve, reject) => {
    sgMail
      .send(message)
      .then((response) => {
        console.log(response);
        resolve('Email sent successfully');
      })
      .catch((error) => {
        reject(error);
      });
  });
};
