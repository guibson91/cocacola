import { BaseComponent } from "../../base/base.component";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { cpfCnpjValidator } from "src/app/util/validators";
import { FormBuilder, Validators } from "@angular/forms";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { patternCpfCnpjMask } from "src/app/util/masks";
import { removeSymbol } from "src/app/util/util";
import { User } from "src/app/models/user";
import { validateCpfCnpj } from "src/app/util/cpfcnpj";

@Component({
  selector: "app-cpf-cnpj",
  templateUrl: "./cpf-cnpj.component.html",
  styleUrls: ["./cpf-cnpj.component.scss"],
})
export class CpfCnpjComponent extends BaseComponent {
  @Output() next = new EventEmitter();

  form = this.fb.group({
    cpfCnpj: ["", [Validators.required, cpfCnpjValidator()]],
  });

  readonly cpfCnpjMask: MaskitoOptions = patternCpfCnpjMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(public fb: FormBuilder) {
    super();
  }

  updateClientWithCpfCnpj(cpfCnpj) {
    const client: User = {
      cpfCnpj: String(cpfCnpj),
      company: {
        cnpj: cpfCnpj.length > 11 ? String(cpfCnpj) : "",
      },
      responsible: {
        cpfPartner: cpfCnpj.length === 11 ? cpfCnpj : "",
      },
    };
    this.register.client = client;
    this.register.cpfCnpj = String(cpfCnpj);
  }

  async nextClick() {
    const cpfCnpj = this.form.value.cpfCnpj ? removeSymbol(String(this.form.value.cpfCnpj)) : null;

    if (cpfCnpj) {
      if (!validateCpfCnpj(cpfCnpj)) {
        return this.system.showErrorAlert(new Error("CPF/CNPJ inválido"));
      }
      this.register.clearClient();
      this.updateClientWithCpfCnpj(cpfCnpj);

      const loading = await this.system.loadingCtrl.create({});
      loading.present();
      this.shared.get<User>("register/registration-status?cpfCnpj=" + removeSymbol(cpfCnpj), true).subscribe({
        next: (res) => {
          loading.dismiss();
          if (res.maintenanceTotal) {
            this.router.navigateByUrl("/maintenance");
            return;
          }
          if (res.status && res.data) {
            if (
              res.data.userStatus === "db_client_created" ||
              res.data.userStatus === "no_register_created" ||
              res.data.userStatus === "no_register_company" ||
              res.data.userStatus === "no_register_document"
            ) {
              this.register.client = res.data;
            } else {
              this.register.client = { userStatus: res.data.userStatus };
            }
            if (!this.register.cpfCnpj) {
              this.updateClientWithCpfCnpj(cpfCnpj);
            }
            this.next.emit();
          } else {
            this.system.showErrorAlert(new Error(res.message));
          }
        },
      });
    } else {
      console.error("CPF/CNPJ não pode ser vazio.");
      this.system.showErrorAlert(new Error("CPF/CNPJ não pode ser vazio."));
    }
  }
}
