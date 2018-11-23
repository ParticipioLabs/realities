import sgMail from '@sendgrid/mail';
import pug from 'pug';
import { getPeopleTwoStepsFromReality } from '../graphql/connectors';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const appUrl = process.env.APP_URL;

const sendMail = message =>
  new Promise((resolve, reject) => {
    sgMail
      .send(message)
      .then(() => {
        resolve('Email sent successfully');
      })
      .catch((error) => {
        reject(error);
      });
  });

export const sendUpdateMail = async (
  driver,
  user,
  args,
  oldRealityData,
  updatedRealityData) => {
  const realityData = {
    description: (oldRealityData.description === updatedRealityData.description
      ? false
      : { new: updatedRealityData.description, old: oldRealityData.description }),
    title: (oldRealityData.title === updatedRealityData.title
      ? false
      : { new: updatedRealityData.title, old: oldRealityData.title }),
    guide: (oldRealityData.guideEmail === args.guideEmail
      ? false
      : { new: args.guideEmail, old: oldRealityData.guideEmail }),
    realizer: (oldRealityData.realizerEmail === args.realizerEmail
      ? false
      : { new: args.realizerEmail, old: oldRealityData.realizerEmail }),
  };
  if (Object.values(realityData).every(item => item === false)) {
    return false;
  }
  const template = pug.compileFile('src/email/templates/updateReality.pug');
  const emailHtml = template({
    realityUrl: appUrl + updatedRealityData.nodeId,
    realityName: oldRealityData.title,
    description: realityData.description,
    title: realityData.title,
    guide: realityData.guide,
    realizer: realityData.realizer,
    userEmail: user.email,
  });
  const people = await getPeopleTwoStepsFromReality(driver, args);
  const emails = people.map(person => (person.email))
    .filter(email => email !== user.email)
    .filter((v, i, a) => a.indexOf(v) === i);
  if (emails.length) {
    const message = {
      to: emails,
      from: {
        email: process.env.FROM_EMAIL || 'realities@theborderland.se',
        name: process.env.FROM_NAME || 'Realities',
      },
      subject: 'A reality has been updated',
      text: 'text missing for now',
      html: emailHtml,
    };
    return sendMail(message);
  }
  return false;
};

export default {
  sendUpdateMail,
};
