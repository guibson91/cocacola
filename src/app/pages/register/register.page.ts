import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonContent, IonicModule, NavController } from "@ionic/angular";
import { RegisterModule } from "src/app/components/register/register.module";
import { StepId, Step, getDbClientStepsId, getNoRegisterStepsId, getSteps } from "src/app/models/step";
import { Subject, Subscription, fromEvent, takeUntil } from "rxjs";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule, RegisterModule],
})
export class RegisterPage extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  stepLabels: string[] = [];

  steps: Step[] = [];

  currentIndex: number;

  subscriptionBackButton: Subscription;

  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(public navCtrl: NavController) {
    super();
  }

  ngOnDestroy(): void {
    if (!this.unsubscriber.closed) {
      this.unsubscriber.next();
      this.unsubscriber.complete();
    }
    if (this.subscriptionBackButton) {
      this.subscriptionBackButton.unsubscribe();
    }
  }

  ngOnInit() {
    this.handleBrowserBackButton();
    this.initBackButton();
    if (!this.register.client.cpfCnpj || !this.register.client.userStatus) {
      console.error("cpfCnpj e userStatus deveria existir nessa página");
      this.navCtrl.navigateRoot("intro");
      return;
    } else {
      this.initStepLabels();
      this.initSteps();
    }
  }

  handleBrowserBackButton() {
    history.pushState(null, "");
    fromEvent(window, "popstate")
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((_) => {
        history.pushState(null, "");
        this.back();
      });
  }

  initBackButton() {
    this.subscriptionBackButton = this.shared.platform.backButton.subscribeWithPriority(100, async () => {
      this.back();
    });
  }

  initStepLabels() {
    this.stepLabels = [];
    //Se usuário já tiver cadastro na base do cliente
    if (this.register.isClientDb) {
      this.stepLabels = ["Informação<br/>pessoal", "Informação<br/>de contato", "Informação<br/>de login"];
    }
    //Se usuário não tiver cadastro na base do cliente
    else {
      this.stepLabels = ["Informação<br/>pessoal", "Informação<br/>de contato", "Dados da<br/>empresa", "Infos.<br/>pedido"];
    }
  }

  initSteps() {
    this.steps = [];
    let stepsId: StepId[] = [];
    switch (this.register.client.userStatus) {
      case "active":
        this.system.showAlert("none", "Atenção", "CPF/CNPJ já cadastrado e ativo no sistema. Por favor, efetue login.", "Entendi", () => {
          this.navCtrl.navigateRoot("login");
        });
        break;
      case "blocked":
        this.system.showAlert("none", "Atenção", "CPF/CNPJ bloqueado no sistema. Por favor, contate a administração", "Entendi", () => {
          this.navCtrl.back();
        });
        break;
      case "canceled":
        this.system.showAlert("none", "Atenção", "CPF/CNPJ não aprovado no sistema. Por favor, contate a administração", "Entendi", () => {
          this.navCtrl.back();
        });
        break;
      case "review":
        this.system.showAlert("none", "Atenção", "CPF/CNPJ está sendo avaliado pela nossa equipe. Por favor, tente novamente mais tarde", "Entendi", () => {
          this.navCtrl.back();
        });
        break;
      case "db_client":
        stepsId = getDbClientStepsId(this.register.isCpf);
        this.currentIndex = 0;
        break;
      case "db_client_created":
        stepsId = getDbClientStepsId(this.register.isCpf);
        this.currentIndex = stepsId.length - 1;
        break;
      case "no_register":
        stepsId = getNoRegisterStepsId(this.register.isCpf);
        this.currentIndex = 0;
        break;
      case "no_register_created":
        stepsId = getNoRegisterStepsId(this.register.isCpf);
        const no_register_created_index = stepsId.indexOf("password");
        this.currentIndex = no_register_created_index + 1;
        break;
      case "no_register_company":
        stepsId = getNoRegisterStepsId(this.register.isCpf);
        const no_register_company_index = stepsId.indexOf("company");
        this.currentIndex = no_register_company_index + 1;
        break;
      case "no_register_document":
        stepsId = getNoRegisterStepsId(this.register.isCpf);
        const no_register_document_index = stepsId.indexOf("documents");
        this.currentIndex = no_register_document_index + 1;
        break;
      default:
        console.error("UserStatus não mapeado!");
        break;
    }
    this.steps = getSteps(stepsId, this.register.isClientDb);
  }

  next() {
    const maxIndex = this.steps.length - 1;
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      setTimeout(() => {
        this.content.scrollToTop(200);
      }, 20);
    } else {
      this.finishRegister();
    }
  }

  async finishRegister() {
    const payload = this.register.client.cpfCnpj ? { ...this.register.client, finished: true } : { ...this.register.client, cpfCnpj: this.register.cpfCnpj, finished: true };

    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.post("register/logistic", payload, undefined, undefined, true).subscribe((res) => {
      loading.dismiss();
      if (res.status) {
        this.register.clearClient();
        // const msg = 'Você completou seu cadastro com sucesso! Você já pode acessar o APP com o login e senha que você criou! Boas compras!';
        const msg = "Você completou seu cadastro com sucesso! Em breve seu acesso será liberado";
        this.system.showAlert(
          "success-coke",
          "Parabéns",
          msg,
          "Entendi",
          () => {
            this.navCtrl.navigateRoot("login");
          },
          undefined,
          undefined,
        );
      } else {
        this.system.showErrorAlert(new Error(res.message ? res.message : "Falha ao finalizar cadastro de usuário"));
      }
    });

    setTimeout(() => {
      loading.dismiss();
      this.ref.detectChanges();
    }, 1500);
  }

  override back() {
    if (this.currentIndex > 0) {
      const previewStep = this.steps[this.currentIndex - 1];
      if (previewStep.id === "password") {
        this.system.showErrorAlert(new Error("Você não pode retornar para o início do cadastro. Você poderá finalizar ou cancelar seu registro"));
      } else {
        this.currentIndex--;
      }
    } else {
      this.navCtrl.navigateRoot("login");
    }
  }
}
