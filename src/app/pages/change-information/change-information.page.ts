import { BaseComponent } from "src/app/components/base/base.component";
import { cellphoneValidator } from "src/app/util/validators";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormBuilder, FormsModule, Validators } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { patternPhoneMask } from "src/app/util/masks";

@Component({
  selector: "app-change-information",
  templateUrl: "./change-information.page.html",
  styleUrls: ["./change-information.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class ChangeInformationPage extends BaseComponent implements OnInit {
  form = this.fb.group({
    cellphone: ["", [Validators.required, cellphoneValidator]],
  });

  readonly phoneMask: MaskitoOptions = patternPhoneMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit() {}

  async changeResponsible() {
    let { cellphone } = this.form.value;
    if (!cellphone) {
      this.system.showErrorAlert(new Error("Novo número de celular não pode ser vazio"));
    }
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared
      .put("register/responsible", {
        responsible: {
          cellphone: cellphone,
        },
      })
      .subscribe((res) => {
        loading.dismiss();

        if (res && res.status && res.data) {
          const newUser = {
            ...this.shared.user,
            responsible: {
              ...res.data,
            },
          };
          this.storage.set("auth", {
            accessToken: this.shared.accessToken,
            refreshToken: this.shared.refreshToken,
            user: newUser,
          });
          this.shared.user$.next(newUser);
          this.system.showToast("Numéro de telefone alterado com sucesso", 2000);
          this.back();
        }
      });
  }
}
