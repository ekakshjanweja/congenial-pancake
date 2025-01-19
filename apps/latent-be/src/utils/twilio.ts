const twilio = require("twilio");

const accountId = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountId, authToken);

if (!accountId || !authToken) {
  throw new Error(
    "TWILIO_ACCOUNT_SID and/or TWILIO_AUTH_TOKEN environment variables are required"
  );
}

export async function sendMessage(body: string, to: string) {
  const message = await twilioClient.messages.create({
    body,
    to,
    from: Bun.env.TWILIO_PHONE_NUMBER,
  });

  console.log(message.body);
}
