export const catchSignInWithCredential = (err: any) => {
  const error: NanoError = {
    title: err.code ? err.code : "Ops!",
    message: err.message ? err.message : `Se esse erro se repetir, por favor contate o suporte. código: ${err.code}`,
  };
  switch (err.code) {
    case "auth/account-exists-with-different-credential":
      error.title = "Conta já existe";
      error.message =
        "Uma conta já existe com o mesmo endereço de e-mail, mas credenciais de login diferentes." + "Faça login usando um provedor associado a este endereço de e-mail.";
      break;
    case "auth/invalid-credential":
      break;
    case "auth/operation-not-allowed":
      break;
    case "auth/user-disabled":
      error.title = "Esse usuário foi desativado";
      error.message = "Entre em contato com o suporte para mais informações.";
      break;
    case "auth/user-not-found":
      error.title = "Usuário não encontrado";
      error.message = "Verifique se o e-mail está correto e tente novamente.";
      break;
    case "auth/wrong-password":
      error.title = "Senha incorreta";
      error.message = "Tente novamente.";
      break;
    case "aauth/invalid-verification-code":
      break;
    case "auth/invalid-verification-id":
      break;
    default:
      break;
  }
  return error;
};

export const authError = (code: string): Error => {
  switch (code) {
    case "auth/invalid-email":
      return Error("E-mail inválido");
    case "auth/user-disabled":
      return Error("Usuário desabilitado");
    case "auth/user-not-found":
      return Error("Usuário não encontrado");
    case "auth/wrong-password":
      return Error("Senha incorreta");
    case "auth/email-already-in-use":
      return Error("Email já está em uso");
    case "auth/weak-password":
    case "auth/invalid-password":
      return Error("Senha inválida");
    default:
      console.error("Um erro aleatório aconteceu", code);
      return Error("Algo de errado aconteceu. Tente novamente mais tarde.");
  }
};

interface NanoError {
  title: string;
  message: string;
}
