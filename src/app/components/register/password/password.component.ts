import { BaseComponent } from "../../base/base.component";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { LoadingController } from "@ionic/angular";
import { passwordMatchValidator, passwordValidator } from "src/app/util/validators";
import { User } from "src/app/models/user";
import { cpfCnpj } from "../../../util/util";

@Component({
  selector: "app-password",
  templateUrl: "./password.component.html",
  styleUrls: ["./password.component.scss"],
})
export class PasswordComponent extends BaseComponent {
  @Output() next = new EventEmitter();

  @Input() recovery = false;
  @Input() code: string;
  @Input() username: string;

  form = this.fb.group(
    {
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20), passwordValidator()]],
      password2: ["", [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  constructor(
    public fb: FormBuilder,
    public loadingCtrl: LoadingController,
  ) {
    super();
  }

  async nextClick() {
    if (this.form.invalid) {
      return;
    }
    const { password } = this.form.value;
    if (!password) {
      this.system.showErrorAlert(new Error("Senha não pode ser vazio"));
      console.error("Senha não pode ser vazio");
    }
    if (this.recovery) {
      this.handleRecovery(password);
    } else {
      this.handleRegister(password);
    }
  }

  async handleRecovery(password) {
    const loading = await this.loadingCtrl.create({});
    loading.present();
    this.shared
      .post(
        "user/reset-password",
        {
          password: password,
          code: this.code,
          username: this.username,
        },
        undefined,
        undefined,
        true,
      )
      .subscribe((res) => {
        loading.dismiss();
        if (res.status) {
          this.system.showAlert("success", "Pronto!", "Sua senha foi alterada com sucesso. Não compartilhe ela com ninguém.", "Voltar", () => {
            if (this.shared.user && this.shared.accessToken) {
              this.shared.navCtrl.navigateRoot("tabs/home");
            } else {
              this.shared.navCtrl.navigateRoot("login");
            }
          });
        } else {
          this.system.showErrorAlert(new Error(res.message));
        }
      });
  }

  async handleRegister(password) {
    const client: User = {
      responsible: {
        password,
      },
    };
    this.register.client = client;
    if (this.register.client.userStatus === "db_client" || this.register.client.userStatus === "db_client_created") {
      this.register.client.finished = true;
    } else {
      this.register.client.finished = false;
    }

    const payload = this.register.client.cpfCnpj ? this.register.client : { ...this.register.client, cpfCnpj: this.register.cpfCnpj };

    const loading = await this.loadingCtrl.create({});
    loading.present();
    this.shared.post("register/responsible", payload).subscribe((res) => {
      loading.dismiss();
      if (res.status) {
        this.system.showAlert(
          "success",
          "Atenção",
          "Essa senha é muito importante. <br/>Ela vai dar acesso ao app de compras Orbitta, não compartilhe ela com ninguém.",
          this.register.client.finished ? "Finalizar" : "Continuar",
          () => {
            if (this.register.client.finished) {
              this.register.clearClient();
              this.shared.navCtrl.navigateRoot("login");
            } else {
              this.next.emit();
            }
          },
        );
      }
      // else if (res.httpStatus === 302) {
      //   this.system.showAlert("none", "Atenção", res.message, "Ir para login", async () => {
      //     this.shared.navCtrl.navigateBack("tabs/cart");
      //   });
      // }
      else {
        this.register.clearClient();
        this.system.showErrorAlert(new Error(res.message));
      }
    });
  }
}
