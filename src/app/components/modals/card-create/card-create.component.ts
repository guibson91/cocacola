import * as CryptoJS from "crypto-js";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { cpfCnpjValidator, creditCardValidator, expirationDateValidator } from "src/app/util/validators";
import { FormBuilder, Validators } from "@angular/forms";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { patternCardMask, patternCpfCnpjMask, patternDateMask } from "src/app/util/masks";
import { removeSymbol } from "src/app/util/util";
import { Component } from "@angular/core";
import { encryptKey } from "src/main";

@Component({
  selector: "app-card-create",
  templateUrl: "./card-create.component.html",
  styleUrls: ["./card-create.component.scss"],
})
export class CardCreateComponent extends BaseModalComponent {
  form = this.fb.group({
    name: ["", Validators.required],
    cardNumber: ["", [Validators.required, creditCardValidator()]],
    expirationDate: ["", [Validators.required, expirationDateValidator()]],
    securityCode: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    cpfCnpj: ["", [Validators.required, cpfCnpjValidator()]],
  });

  readonly cardMask: MaskitoOptions = patternCardMask;
  readonly dateMask: MaskitoOptions = patternDateMask;
  readonly cpfCnpjMask: MaskitoOptions = patternCpfCnpjMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(public fb: FormBuilder) {
    super();
  }

  async registerCard() {
    const cardEncrypted = JSON.parse(this.getEncryptedCard());
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    const payload = {
      card: cardEncrypted,
    };
    this.shared.post("register/cards", payload).subscribe((res: any) => {
      loading.dismiss();
      if (res.status) {
        this.closeModal("success");
        this.system.showToast("Cartão de crédito salvo com sucesso");
      } else {
        this.system.showErrorAlert(new Error(res.message));
      }
    });
  }

  getEncryptedCard() {
    const form = this.form.value;
    const CryptoJSAesJson = {
      stringify: function (cipherParams) {
        var j: any = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
      },
      parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
        return cipherParams;
      },
    };
    const key = encryptKey;
    const exp_month = String(form.expirationDate).split("/")[0];
    const exp_year = String(form.expirationDate).split("/")[1];
    const card = {
      number: removeSymbol(String(form.cardNumber)),
      cvc: form.securityCode,
      exp_month,
      exp_year,
      name: form.name,
      document_number: removeSymbol(String(form.cpfCnpj)),
    };
    const encryptedCard = CryptoJS.AES.encrypt(JSON.stringify(card), key, { format: CryptoJSAesJson }).toString();
    return encryptedCard;
  }
}
