const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const environment = process.env.ENVIRONMENT || "development";
const toPhoneNumbers = process.env[`PHONE_NUMBERS_${environment.toUpperCase()}`].split(",");
const fromPhoneNumber = process.env.FROM_PHONE_NUMBER;
const downloadLink = process.argv[2];

const messageBody = `Olá, aqui está o link para download da APK Orbitta ${environment.toUpperCase()}: ${downloadLink}`;

toPhoneNumbers.forEach((number) => {
  client.messages
    .create({
      body: messageBody,
      from: fromPhoneNumber,
      to: number,
    })
    .then((message) => console.log(`SMS enviado com sucesso para ${number}! ID da mensagem: ${message.sid}`))
    .catch((error) => console.error(`Erro ao enviar SMS para ${number}: ${error.message}`));
});
