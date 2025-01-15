import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { cpfCnpjValidator } from "src/app/util/validators";
import { FormBuilder, FormsModule, Validators } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { patternCpfCnpjMask } from "src/app/util/masks";
import { validateCpfCnpj } from "src/app/util/cpfcnpj";
import { removeSymbol } from "src/app/util/util";
import { RegisterModule } from "src/app/components/register/register.module";

@Component({
  selector: "app-recovery-password",
  templateUrl: "./recovery-password.page.html",
  styleUrls: ["./recovery-password.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule, RegisterModule],
})
export class RecoveryPasswordPage extends BaseComponent implements OnInit {
  waitTime: number;

  step = 1;

  form = this.fb.group({
    cpfCnpj: ["", [Validators.required, cpfCnpjValidator()]],
  });

  readonly cpfCnpjMask: MaskitoOptions = patternCpfCnpjMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  errorMessage?;
  phoneMask;

  cpfCnpj;
  code;

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    if (this.shared.user?.cpfCnpj) {
      this.form.get("cpfCnpj")?.setValue(this.shared.user.cpfCnpj);
      this.sendVerificationCode();
    }
  }

  async sendVerificationCode() {
    const cpfCnpj = this.form.value.cpfCnpj ? removeSymbol(String(this.form.value.cpfCnpj)) : null;
    if (cpfCnpj) {
      if (!validateCpfCnpj(cpfCnpj)) {
        this.errorMessage = "CPF/CNPJ inválido";
        return;
      }

      this.errorMessage = "";
      this.cpfCnpj = cpfCnpj;
      const loading = await this.system.loadingCtrl.create({});
      loading.present();
      this.shared.post<{ expiration: number; phoneMask: string; emailMask: string }>(`user/reset-password/sms/${cpfCnpj}`, {}).subscribe((res) => {
        loading.dismiss();
        if (res.status && res.data) {
          this.waitTime = res.data.expiration;
          this.phoneMask = res.data.phoneMask;

          this.errorMessage = "";
          this.step++;
        } else {
          this.errorMessage = res.message ? res.message : "Usuário não cadastrado. Verifique seus dados e tente novamente";
        }
      });
    }
  }

  next(ev) {
    this.code = ev.code;
    this.step++;
  }

  recovery() {}
}
