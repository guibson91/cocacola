import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from "@angular/core";
import { cpfCnpjValidator } from "src/app/util/validators";
import { FormBuilder, FormsModule, Validators } from "@angular/forms";
import { IonicModule, NavController } from "@ionic/angular";
import { RegisterModule } from "src/app/components/register/register.module";
import { Status } from "src/app/models/user";
import { ParamMap } from "@angular/router";
import Swiper from "swiper";
import { ComponentsModule } from "src/app/components/components.module";
import { Subscription } from "rxjs";

@Component({
  selector: "app-intro",
  templateUrl: "./intro.page.html",
  styleUrls: ["./intro.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule, RegisterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IntroPage extends BaseComponent implements OnInit {
  @ViewChild("swiper") swiperRef: ElementRef;
  swiper: Swiper;

  form = this.fb.group({
    cpfCnpj: ["", [Validators.required, cpfCnpjValidator()]],
  });

  currentIndex = 0;
  last;
  subscriptionBackButton: Subscription;

  constructor(
    public fb: FormBuilder,
    public navCtrl: NavController,
  ) {
    super();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.last = paramMap.get("step") === "last" ? true : false;
    });
  }

  ngOnInit() {
    this.initBackButton();
  }

  ngOnDestroy(): void {
    if (this.subscriptionBackButton) {
      this.subscriptionBackButton.unsubscribe();
    }
  }

  initBackButton() {
    this.subscriptionBackButton = this.shared.platform.backButton.subscribeWithPriority(100, async () => {
      this.navCtrl.navigateRoot("login");
    });
  }

  continue() {
    this.openPage("/login");
    this.storage.set("introViewed", true);
  }

  swiperReady() {
    setTimeout(() => {
      const el = this.swiperRef?.nativeElement;
      if (el && el.swiper) {
        setTimeout(() => {
          this.swiper = el.swiper;
        }, 200);
      }
    }, 200);
  }
  slideChanged() {
    this.currentIndex = this.swiper.activeIndex ? this.swiper.activeIndex : 0;
    this.ref.detectChanges();

    setTimeout(() => {
      this.last = true;
      this.ref.detectChanges();
    }, 325);
  }

  async next() {
    let title: string = "";
    let description: string = "";
    let page: string = "";
    let btn: string = "";
    switch (this.register.client.userStatus) {
      case "active":
        title = "Olá, que bom ter você aqui de volta!";
        description = "Vimos que você já tem cadastro no nosso app. A sua senha e login serão os mesmos.";
        page = "login";
        break;
      case "review":
        title = "Seu cadastro está em análise!";
        description = "Por favor, aguarde uns instantes para que possamos validar tudo certinho.";
        page = "login";
        btn = "Entendi";
        break;
      case "blocked":
        title = "Seu cadastro está em bloqueado!";
        description = "Por favor, contate nossa equipe de suporte para qualquer dúvida a respeito";
        page = "login";
        btn = "Entendi";
        break;
      case "canceled":
        title = "Seu cadastro foi recusado";
        description = "Por favor, contate nossa equipe de suporte para qualquer dúvida a respeito";
        page = "login";
        btn = "Entendi";
        break;
      case "no_register":
        title = "Seja bem-vindo (a)! Que bom ter você aqui!";
        description = "Siga os próximos passos para iniciar suas compras e aproveite as facilidades e benefícios do Orbitta.";
        page = "register";
        break;
      case "db_client":
        title = "Olá, que bom ter você aqui!";
        description = "Vimos que você já faz pedidos com seu vendedor, mas precisamos que se cadastre no app, vamos lá?";
        page = "register";
        break;
      default:
        title = "Olá, que bom ter você aqui<br/> de volta!";
        description = "Vimos que você já iniciou seu cadastro, falta pouco pra finalizá-lo, vamos lá?";
        page = "register";
        break;
    }
    this.storage.set("introViewed", true);
    this.system.showAlert("success", title, description, btn ? btn : "Continuar", () => {
      this.openPage(page);
    });
  }
}
