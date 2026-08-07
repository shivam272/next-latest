import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const { data, error } = await resend.emails.send({
    from: process.env.OFFICIAL_EMAIL as string,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Error sending email:", error);
  }
  return data;
};
