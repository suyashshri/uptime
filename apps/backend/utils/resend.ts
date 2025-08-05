import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMail(to: string, otp: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .otp-box {
            background-color: #f0f9ff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            letter-spacing: 5px;
            font-weight: bold;
            color: #2563eb;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            font-size: 12px;
            text-align: center;
            color: #6b7280;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Uptime OTP Verification</h2>
            <p>Please use the following OTP to verify your email address.</p>
          </div>
          <div class="otp-box">${otp}</div>
          <div class="footer">
            <p>This OTP will expire in 10 minutes.</p>
            <p>Do not share this code with anyone.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [to],
    subject: "OTP Verification for Uptime",
    html,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}
