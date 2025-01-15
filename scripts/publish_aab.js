const { google } = require("googleapis");
const fs = require("fs");

const aabFilePath = process.argv[2];
const serviceAccountKeyPath = process.argv[3];
const releaseNotes = process.argv[4];

async function publishAAB() {
  

  try {
    // Autenticação
    
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountKeyPath,
      scopes: ["https://www.googleapis.com/auth/androidpublisher"],
    });

    const authClient = await auth.getClient();
    const androidPublisher = google.androidpublisher({
      version: "v3",
      auth: authClient,
    });

    const packageName = "br.com.mobiup.sorocabarefrescos";

    // Criando nova edição
    
    const edit = await androidPublisher.edits.insert({
      packageName,
    });

    const editId = edit.data.id;
    

    // Upload do AAB
    
    const res = await androidPublisher.edits.bundles.upload({
      packageName,
      editId,
      media: {
        mimeType: "application/octet-stream",
        body: fs.createReadStream(aabFilePath),
      },
    });

    const versionCode = res.data.versionCode;
    

    const releaseDate = new Date().toLocaleDateString("pt-BR");

    // Gerando nome da versão
    const releaseName = `Versão ${versionCode} - ${releaseDate}`;

    // Atualizando o track
    
    await androidPublisher.edits.tracks.update({
      packageName,
      editId,
      track: "production",
      requestBody: {
        releases: [
          {
            name: releaseName,
            versionCodes: [versionCode],
            releaseNotes: [
              {
                language: "pt-BR",
                text: releaseNotes,
              },
            ],
            status: "completed",
          },
        ],
      },
    });

    // Confirmando a edição
    
    await androidPublisher.edits.commit({
      packageName,
      editId,
    });

    
  } catch (error) {
    console.error("Falha ao publicar o AAB:", error);
    process.exit(1);
  }
}

publishAAB().catch((err) => {
  console.error("Erro inesperado:", err);
  process.exit(1);
});
