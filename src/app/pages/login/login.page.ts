import { BaseComponent } from "src/app/components/base/base.component";
import { combineLatest, first } from "rxjs";
import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { currentVersion } from "src/environments/version";
import { environment } from "src/environments/environment";
import { EnvironmentType } from "@app/models/env";
import { FormBuilder, FormsModule, Validators } from "@angular/forms";
import { GetnetService } from "src/app/services/getnet.service";
import { IonContent, IonicModule } from "@ionic/angular";
import { NativeBiometric } from "capacitor-native-biometric";
import { removeSymbol } from "src/app/util/util";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class LoginPage extends BaseComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  enableBiometric = false;
  showBiometric = false;

  form = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });

  remember = false;

  hasCpfCnpj = false;

  errorMessage: string;

  environment: EnvironmentType;

  buildTime = currentVersion.buildTime;

  constructor(
    public fb: FormBuilder,
    public getnet: GetnetService,
  ) {
    super();
  }

  ngOnInit() {
    this.environment = environment;
    this.checkBiometricAvailability();
    if (this.register.client && this.register.client.cpfCnpj) {
      this.form.patchValue({ username: removeSymbol(this.register.client.cpfCnpj) });
      this.hasCpfCnpj = true;
      this.ref.detectChanges();
    } else {
      this.hasCpfCnpj = false;
      this.ref.detectChanges();
    }
  }

  async checkBiometricAvailability() {
    try {
      const result = await NativeBiometric.isAvailable();

      if (result.isAvailable) {
        this.showBiometric = true;
        this.ref.detectChanges();
      } else {
        this.showBiometric = false;
      }
    } catch {
      this.showBiometric = false;
    }
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.content.scrollToTop(500);
    }, 50);
  }

  async login() {
    const form = this.form.value;
    if (!form.username || !form.password) {
      return;
    }
    if (form.username.includes("@")) {
    } else {
      form.username = removeSymbol(form.username);
    }
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared
      .signin(form.username, form.password)
      .pipe(first())
      .subscribe((res) => {
        if (res.maintenanceTotal) {
          loading.dismiss();
          this.router.navigateByUrl("/maintenance");
          return;
        }
        if (res.data.accessToken) {
          loading.dismiss();
          this.handleSuccess(res);
        } else {
          loading.dismiss();
          this.errorMessage = res.message
            ? res.message
            : `Usuário ou senha incorretos. Tente novamente ou clique em
          <b>“Esqueci minha senha”</b> para cadastrar uma nova senha.`;
        }
      });
  }

  handleSuccess(res: any) {
    this.errorMessage = "";
    this.register.clearClient(true);
    this.shared.accessToken = res.data.accessToken;
    this.shared.refreshToken = res.data.refreshToken;
    try {
      this.getnet.generateSessionId(res.data.user).subscribe((sessionId) => {
        this.shared.sendOneSignalData().subscribe();
        if (this.showBiometric && this.enableBiometric) {
          this.shared.storage.set("biometric", true);
        } else {
          this.shared.storage.set("biometric", false);
        }
        if (this.remember || this.enableBiometric) {
          this.storage.set("sessionId", sessionId);
          this.storage.set("auth", {
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            user: res.data.user,
          });
        } else {
          this.storage.set("sessionId", null);
          this.storage.set("auth", null);
        }
        if (this.shared.user$ && !this.shared.user$.closed) {
          this.shared.user$.next(res.data.user);
        }

        if (res.maintenanceParcial || res.maintenanceTotal) {
          this.router.navigateByUrl("/maintenance");
          return;
        } else {
          this.handleNavigation();
        }
      });
    } catch (error) {
      console.error("Erro ao gerar sessionId: ", error);
      this.router.navigateByUrl("/maintenance");
    }
  }

  async handleNavigation() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    combineLatest([this.cart.loadData(), this.shared.getNotifications(), this.shared.loadCustomer()])
      .pipe(first())
      .subscribe({
        next: () => {
          this.shared.storage.get("walkthroughViewed").then((res) => {
            loading.dismiss();
            this.form.reset();
            if (res) {
              this.openPage("/tabs/home");
            } else {
              this.openPage("/walkthrough");
            }
          });
        },
        error: (error) => {
          loading.dismiss();
          console.error("Erro ao carregar dados iniciais:", error);
          this.loadingService.loading$.next(false);
          this.openPage("/maintenance");
        },
      });
  }

  openIntro() {
    this.shared.navCtrl.navigateRoot([
      "intro",
      {
        step: "last",
      },
    ]);
  }

  openRecoveryPassword() {
    this.openPage("recovery-password");
  }
}
