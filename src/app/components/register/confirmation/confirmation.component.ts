import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { LoadingController } from "@ionic/angular";
import { BaseComponent } from "../../base/base.component";
import { applicationClientId } from "src/main";

const WAIT_TIME = 120000; //2min

@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"],
})
export class ConfirmationComponent extends BaseComponent implements OnInit {
  @Input() showHeader = true;

  @Input() waitTime: number;

  @Input() cpfCnpj: string;

  @Input() phoneMask?: string;

  @Input() recovery = false;

  @Output() next = new EventEmitter();

  emailMask?: string;

  form = this.fb.group({
    code: ["", [Validators.required]],
  });

  blocked = true;

  time;

  intervalId: any;

  invalidCode: boolean = false;

  constructor(
    public fb: FormBuilder,
    public loadingCtrl: LoadingController,
  ) {
    super();
  }

  ngOnInit() {
    if (!this.recovery) {
      this.send();
      this.startCountdown();
    } else {
      this.startCountdown();
    }
  }

  async send() {
    if (!this.recovery) {
      this.sendRegister();
    }
  }

  private async resendRecovery(type: "email" | "sms") {
    const loading = await this.loadingCtrl.create({});
    loading.present();
    this.shared
      .post<{ expiration: number; phoneMask: string; emailMask: string }>(
        type === "sms"
          ? `user/reset-password/sms/${this.cpfCnpj}?authClientId=${applicationClientId}`
          : `user/reset-password/email/${this.cpfCnpj}?authClientId=${applicationClientId}`,
        {
          username: this.cpfCnpj ? this.cpfCnpj : "",
          authClientId: applicationClientId,
        },
      )
      .subscribe((res) => {
        loading.dismiss();
        if (res && res.status) {
          console.info("Código enviado com sucesso");
          if (type === "sms" && res.data.phoneMask) {
            this.phoneMask = res.data.phoneMask;
            this.emailMask = undefined;
          } else {
            this.emailMask = res.data.emailMask;
            this.phoneMask = undefined;
          }
          this.startCountdown();
        } else {
          this.system.showToast(res.message ? res.message : "Falha ao enviar código");
        }
      });
  }

  private sendRegister() {
    this.shared
      .post("register/send-code", {
        cpfCnpj: this.register.client.cpfCnpj,
        choice: "sms",
        responsible: this.register.client.responsible,
      })
      .subscribe((res) => {
        if (res && res.status) {
          console.info("Código enviado com sucesso");
        } else {
          this.system.showToast(res.message ? res.message : "Falha ao enviar código");
        }
      });
  }

  async resendRegister(type: "email" | "sms") {
    const loading = await this.loadingCtrl.create({});
    loading.present();
    this.shared
      .post("register/send-code", {
        cpfCnpj: this.register.client.cpfCnpj,
        choice: type ? type : "sms",
        responsible: this.register.client.responsible,
      })
      .subscribe((res) => {
        loading.dismiss();
        if (res && res.status) {
          this.system.showToast("Código enviado");
          this.startCountdown();
        } else {
          this.system.showErrorAlert(new Error(res.message ? res.message : "Falha ao enviar código"));
        }
      });
  }

  startCountdown() {
    this.blocked = true;
    if (this.waitTime) {
      this.time = this.waitTime * 1000;
    } else {
      this.time = WAIT_TIME;
    }
    this.intervalId = setInterval(() => {
      if (this.time > 0) {
        this.time -= 1000; // reduce time by 1 second
      } else {
        this.blocked = false;
        clearInterval(this.intervalId);
        this.ref.detectChanges();
      }
    }, 1000);
  }

  get formattedTime() {
    let minutes = Math.floor(this.time / 60000);
    let seconds = (this.time % 60000) / 1000;
    return `${minutes}:${seconds.toFixed(0).padStart(2, "0")}`;
  }

  async resend(type: "email" | "sms") {
    if (this.recovery) {
      this.resendRecovery(type);
    } else {
      this.resendRegister(type);
    }
  }

  async changeInput() {
    const value = this.form.value.code;
    if (value?.length === 4) {
      const loading = await this.loadingCtrl.create({
        message: "Validando código",
      });
      loading.present();
      const obs$ = this.recovery
        ? this.shared.post(
            `user/reset-password/validate-code?authClientId=${applicationClientId}`,
            {
              code: value,
              username: this.cpfCnpj,
              authClientId: applicationClientId,
            },
            undefined,
            undefined,
            true,
          )
        : this.shared.get(`register/check-code?cpfCnpj=${this.register.client.cpfCnpj}&code=${value}`, true);
      obs$.subscribe((res) => {
        loading.dismiss();
        if (res.status) {
          this.invalidCode = false;
          this.next.emit({ code: value });
        } else {
          this.invalidCode = true;
          this.form.patchValue({ code: "" });
        }
      });
    }
  }
}
