export const cleanObject = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object") {
      cleanObject(obj[key]);
    } else if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
      delete obj[key];
    }
  });
  return obj;
};

export const isFunction = (functionToCheck: any) => functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";

export const getMonthName = (monthNumber: number): string => {
  switch (monthNumber) {
    case 0:
      return "Janeiro";
    case 1:
      return "Fevereiro";
    case 2:
      return "Marco";
    case 3:
      return "Abril";
    case 4:
      return "Maio";
    case 5:
      return "Junho";
    case 6:
      return "Julho";
    case 7:
      return "Agosto";
    case 8:
      return "Setembro";
    case 9:
      return "Outubro";
    case 10:
      return "Novembro";
    case 11:
      return "Dezembro";
    default:
      return "Inexistente";
  }
};

/**
 * Remover caracteres especiais de uma string
 */
export const removeSymbol = (doc: string) => {
  if (!doc) {
    return "";
  }
  return doc.replace(/\s/g, "").replace(/\./g, "").replace("-", "").replace("/", "").replace("(", "").replace(")", "");
};

export const getStringNames = (keys: string | string[] | undefined, list: { label: string; key: string }[], omitOther?: boolean): string => {
  if (!keys || !list || list.length === 0) {
    return "";
  } else if (typeof keys === "string") {
    const key = keys;
    if (key === "-1" && omitOther) {
      return "";
    }
    const element = list.find((e) => key === e.key);
    if (element) {
      return element.label;
    } else {
      return "";
    }
  } else {
    const names: string[] = [];
    keys.forEach((key) => {
      const element = list.find((e) => key === e.key);
      if (element) {
        names.push(element.label);
      }
    });
    return names.join(", ");
  }
};

export const getArrayNames = (keys: string | string[] | undefined, list: { label: string; key: string }[]): string[] => {
  if (!keys || !list || list.length === 0) {
    return [];
  }
  if (typeof keys === "string") {
    const key = keys;
    const element = list.find((e) => key === e.key);
    if (element) {
      return [element.label];
    } else {
      return [];
    }
  } else {
    const names: string[] = [];
    keys.forEach((key) => {
      const element = list.find((e) => key === e.key);
      if (element) {
        names.push(element.label);
      }
    });
    return names;
  }
};

export function getAge(dateString: string): number {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * @return number correspondente ao decimal
 * @param decimal_br decimal formato BR (2,01)
 */
export function convertDecimal(decimal_br: any): number {
  if (!decimal_br) return 0;
  if (typeof decimal_br == "number") return decimal_br;
  return Number(decimal_br.replace(".", "*").replace(",", ".").replace("*", ""));
}

export function convertStringNumber(numero: any): string {
  if (!numero) return "0,0";
  if (typeof numero == "string") return numero;
  numero = String(numero);
  return String(numero.replace(".", "*").replace(",", ".").replace("*", ","));
}

/**
 *
 * @param v value de CPF ou CNPJ sem qualquer caracter especial
 * @returns CPF ou CNPJ formatado com tracinhos e pontos
 * @example CPF entrada "03487528304" e saída "034.875.283-04"
 */
export function cpfCnpj(v: string): string {
  //Remove tudo o que não é dígito
  v = v.replace(/\D/g, "");

  if (v.length <= 14) {
    //CPF

    //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2");

    //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d)/, "$1.$2");

    //Coloca um hífen entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    //CNPJ

    //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");

    //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");

    //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");

    //Coloca um hífen depois do bloco de quatro dígitos
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  }

  return v;
}

/**
 * Verificar se data string está formatada como JSON.
 * @param str string
 */
export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Obter o preço em REAIS do produto de acordo com a quantidade adicionada
 * @param product produto
 * @param quantity quantidade
 */
export function getPreco(product: any, encargo?: number, quantity?: number): number {
  if (!product) {
    return 0;
  }

  if (!encargo || typeof encargo != "number") {
    encargo = 0;
  }

  if (quantity === undefined || quantity === null) {
    quantity = product.total_quantity;
  }

  let preco;

  product.preco_minimo = product.precoUnitario;

  //Certificar-se que o produto tem um array de precos
  if (!product.qtde_precos) {
    if (product.preco_minimo) {
      preco = convertDecimal(product.preco_minimo);
    } else {
      preco = 0;
    }
  }
  //Se só tiver um elemento o array de preco, o preco será dele mesmo.
  else if (product.qtde_precos.length == 1) {
    preco = convertDecimal(product.qtde_precos[0].preco_minimo);
  }
  //Se tiver mais um qtde_precos
  else if (product.qtde_precos.length > 1) {
    product.qtde_precos.sort((a: any, b: any) => {
      return Number(a["qtde_minima"]) - Number(b["qtde_minima"]);
    });
    for (let i = 0; i < product.qtde_precos.length; i++) {
      if (product.qtde_precos[i].qtde_minima == quantity || product.qtde_precos[i].qtde_minima == 0) {
        preco = product.qtde_precos[i] ? convertDecimal(product.qtde_precos[i].preco_minimo) : 0;
        break;
      } else if (quantity !== undefined && product.qtde_precos[i].qtde_minima > quantity) {
        preco = product.qtde_precos[i - 1] ? convertDecimal(product.qtde_precos[i - 1].preco_minimo) : 0;
        break;
      }
    }
    if (!preco) preco = product.qtde_precos[product.qtde_precos.length - 1] ? convertDecimal(product.qtde_precos[product.qtde_precos.length - 1].preco_minimo) : 0;
  }
  if (preco) {
    return Number((preco * (1 + encargo / 100)).toFixed(2));
  } else {
    return 0;
  }
}

export function formatDate(date: Date): string {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function elementIsInsideArray(element: any, array: any[]): boolean {
  if (array.indexOf(element) >= 0) {
    return true;
  }
  return false;
}

export function groupElementsByAttribute(data: any, key: string): Array<any> {
  let _products: any[];
  if (data && data.produtos) _products = data.produtos;
  else _products = data;
  return _products.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function isRealImage(url: string): boolean {
  if (url && url.length > 5 && (url.slice(-4) === ".png" || url.slice(-4) === ".svg" || url.slice(-4) === ".jpg" || url.slice(-5) === ".jpeg")) {
    return true;
  }
  return false;
}

export function checkIfImageExists(url: string, callback: Function): void {
  const img = new Image();
  img.src = url;

  if (img.complete) {
    callback(true);
  } else {
    img.onload = () => {
      callback(true);
    };
    img.onerror = () => {
      callback(false);
    };
  }
}

export const countWords = (str: string): number => {
  const words = str.trim().split(/\s+/); // Split the string by whitespace
  return words.length;
};
