require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const environment = process.env.ENVIRONMENT || "development";
const phoneNumbersVariableName = `PHONE_NUMBERS_${environment.toUpperCase()}`;
const whatsappNumbers = process.env[phoneNumbersVariableName].split(",");
const fromWhatsAppNumber = `whatsapp:${process.env.FROM_PHONE_NUMBER}`;
const downloadLink = "https://orbitta-app.s3.amazonaws.com/APK/development/orbitta2.apk";
const buildNumber = "100";

const url = environment === "development" ? "https://orbitta-development.web.app" : environment === "homolog" ? "https://orbitta-homolog.web.app" : "https://orbitta-production.web.app";

whatsappNumbers.forEach((number) => {
  client.messages
    .create({
      contentSid: "HXcf607a87bd72a84e6bbc7a2fea08ff9f",
      from: fromWhatsAppNumber,
      messagingServiceSid: "MG36fcfc5bc70fe55a8014ee2ef09c2419",
      contentVariables: JSON.stringify({
        1: environment.toUpperCase(),
        2: buildNumber,
        3: downloadLink,
        4: url,
      }),
      to: `whatsapp:${number}`,
    })
    .then((message) => console.log(`Mensagem WhatsApp enviada com sucesso para ${number}! ID da mensagem: ${message.sid}`))
    .catch((error) => console.error(`Erro ao enviar mensagem WhatsApp para ${number}: ${error.message}`));
});
