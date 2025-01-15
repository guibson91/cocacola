import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "src/app/services/cart.service";
import { Clipboard } from "@capacitor/clipboard";
import { LinkService } from "src/app/services/link.service";
import { Menu } from "src/app/models/menu";
import { RegisterService } from "src/app/services/register.service";
import { SharedService } from "src/app/services/shared.service";
import { StorageService } from "src/app/services/storage.service";
import { SystemService } from "src/app/services/system.service";
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Output } from "@angular/core";
import { Location } from "@angular/common";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Product } from "@app/models/product";
import { LoadingService } from "@app/services/loading.service";

@Component({
  selector: "app-base",
  template: "",
  styles: [],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BaseComponent {
  protected shared = inject(SharedService);
  protected register = inject(RegisterService);
  protected system = inject(SystemService);
  protected link = inject(LinkService);
  protected storage = inject(StorageService);
  protected cart = inject(CartService);
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected ref = inject(ChangeDetectorRef);
  protected location = inject(Location);
  protected loadingService = inject(LoadingService);
  @Output() clickedItem = new EventEmitter();

  options = {
    duration: 100,
    androiddelay: 0,
    iosdelay: 0,
  };

  cartItemsMap: Map<string, any> = new Map();

  constructor() {}

  back() {
    this.location.back();
  }

  openRegister() {
    this.shared.navCtrl.navigateRoot("register");
  }

  handleIsPP(): boolean {
    const currentUrl = window.location.href;
    if (currentUrl.includes("/tabs/pp")) {
      return true;
    } else {
      return false;
    }
  }

  cancelRegister(cpfCnpj) {
    this.system.showAlert(
      "warn",
      "Atenção",
      "Vimos que você gostaria de cancelar. Seu cadastro será perdido, gostaria mesmo de seguir?",
      "Voltar ao cadastro",
      () => {},
      "Sim, cancelar cadastro",
      () => {
        this.removeAccount(cpfCnpj);
      },
    );
  }

  askRemoveAccount() {
    this.system.showAlert(
      "none",
      "Exclusão de Conta Orbitta",
      `Ao encerrar a sua conta no Orbitta, 
    você perde a opção de comprar direto da fábrica de forma autônoma e flexível com benefícios exclusivos que o Orbitta oferece. 
    Mesmo assim, se decidir cancelar, você ainda poderá comprar através do Consultor que atende sua região.Tem certeza que desejar excluir sua conta no Orbitta?`,
      "Excluir conta",
      () => {
        this.removeAccount();
      },
      "Agora não",
    );
  }

  askRemoveClient() {
    this.system.showAlert(
      "none",
      "Exclusão de Cadastro Sorocaba Refrescos",
      `Ao encerrar seu cadastro na Sorocaba Refrescos, 
    você perde a opção de comprar direto da fábrica com benefícios exclusivos que a Sorocaba Refrescos oferece. 
    Mesmo assim, se decidir cancelar, sua solicitação passará por análise interna para checar possíveis débitos financeiros que não são eliminados no cancelamento do cadastro. 
    Tem certeza que desejar excluir seu cadastro na Sorocaba Refrescos?`,
      "Excluir conta",
      () => {
        this.openSupport();
      },
      "Agora não",
    );
  }

  // async openCartWeb() {
  //   const modal = await this.system.modalCtrl.create({
  //     component: CartContentComponent,
  //     cssClass: 'right-web'
  //   });
  //   modal.present();
  //   modal.onDidDismiss().then((res) => {
  //     if (res.role === "backdrop") {
  //       this.system.closeModal$.next();
  //     }
  //   });
  // }

  async removeAccount(cpfCnpj?) {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.delete<any>(cpfCnpj ? `register/responsible/${cpfCnpj}` : `register/responsible`).subscribe(async (res) => {
      loading.dismiss();
      if (res.status) {
        this.system.showAlert(
          "none",
          "Conta removida",
          "Sua conta foi removida de nossa base de dados. Caso tenha interesse em se registrar novamente, você deve realizar um novo cadastro",
          "Voltar ao início",
          () => {
            this.shared.resetUser();
            this.shared.navCtrl.navigateRoot("login");
          },
        );
      } else {
        this.register.clearClient();
        this.system.showErrorAlert(new Error(res.message ? res.message : "Ocorreu um erro ao tentar remover seus dados cadastrais. Tente novamente mais tarde"));
      }
    });
  }

  async changeStatusBar(type?: "default" | "primary") {
    if (this.shared.platform.is("capacitor") && this.shared.platform.is("ios")) {
      await StatusBar.setStyle({ style: !type || type === "default" ? Style.Light : Style.Dark });
      await StatusBar.setBackgroundColor({ color: !type || type === "default" ? "#efefef" : "#f40000" });
    }
  }

  async copyClipboard(textToCopy: string, successMessage: string) {
    if (this.shared.platform.is("capacitor") || this.shared.platform.is("cordova")) {
      Clipboard.write({
        string: textToCopy,
      })
        .then((res) => {
          console.info("Copiado: ", res);
        })
        .catch((error) => {
          console.error("Error: ", error);
          this.system.showErrorAlert(error);
        });
    } else {
      navigator.clipboard.writeText(textToCopy);
      this.system.showToast(successMessage, 1000);
    }
  }

  openPage(page: any) {
    this.shared.navCtrl.navigateForward(page);
  }

  openItem(item: Menu, action?: Function, type?: string) {
    if (!item || !item.id) {
      return;
    }
    if (this.shared.web) {
      if (action) {
        action();
      } else {
        this.clickedItem.emit(item.id);
      }
    }
    switch (item.id) {
      case "menu-financial":
        this.openPage("tabs/menu/financial");
        break;
      case "loaned-asset":
        this.openPage("tabs/menu/loaned-asset");
        break;
      case "my-business":
        this.openPage("tabs/menu/business");
        break;
      case "config":
        this.openPage("tabs/menu/config");
        break;
      case "my-cards":
        this.openPage([
          "tabs/menu/cards",
          {
            type,
          },
        ]);
        break;
      case "config-alerts":
        this.openPage("tabs/menu/alerts");
        break;
      case "credit-limit":
        this.shared.web ? this.openPage("tabs/menu/financial") : this.openPage("tabs/menu/credit-limit");
        break;
      case "payment-slip":
        this.openPage("tabs/menu/payment-slip");
        break;
      case "loan-historic":
        this.openPage("tabs/menu/loan-historic");
        break;
      case "order":
        this.openPage("tabs/orders");
        break;
      case "payment":
        this.openPage("tabs/menu/payment-debts");
        break;
      case "combo":
        this.link.openLink("https://kombo.coca-cola.com/brasil/sorocaba");
        break;
      case "help":
        this.openSupport();
        break;
      case "qrcode":
        this.openQrcode();
        break;
      case "remove-client":
        this.askRemoveClient();
        break;
      case "remove-account":
        this.askRemoveAccount();
        break;
      case "logout":
        this.handleLogout();
        break;
      default:
        console.error(`Rota ${item.id} não configurada`);
        break;
    }
  }

  async handleLogout() {
    this.system.showAlert(
      "none",
      "Sair",
      "Você tem certeza que deseja deslogar do APP?",
      "Sim",
      () => {
        this.shared.logout("USER").subscribe();
      },
      "Não",
    );
  }

  openQrcode() {
    this.openPage("qrcode");
  }

  async openSupport() {
    this.system.openSupport();
  }

  // initZenDesk() {
  //   window.zESettings = {
  //     webWidget: {
  //       authenticate: {
  //         chat: {
  //           jwtFn: function (callback) {
  //             // Fetch your jwt token and then call our supplied callback below.
  //             callback('YOUR_JWT_TOKEN');
  //           }
  //         }
  //       }
  //     }
  //   };
  // }
}
