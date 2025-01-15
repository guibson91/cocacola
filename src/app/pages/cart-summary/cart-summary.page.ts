import { BaseComponent } from "src/app/components/base/base.component";
import { Checkout, SummaryItem } from "src/app/models/cart";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Pix } from "src/app/models/pix";
import { PixComponent } from "src/app/components/modals/pix/pix.component";
import { GetnetService } from "src/app/services/getnet.service";
import { CartContentComponent } from "src/app/components/modals/cart-content/cart-content.component";

@Component({
  selector: "app-cart-summary",
  templateUrl: "./cart-summary.page.html",
  styleUrls: ["./cart-summary.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CartSummaryPage extends BaseComponent {
  products = [];
  items: any[] = this.products;
  checkout?: Checkout;
  loading;

  summaryItems: SummaryItem[];
  isDeliveryExpress = false;

  constructor(public getnet: GetnetService) {
    super();
  }

  ngOnInit() {
    this.loadSummary();
  }

  handleRefresh(event) {
    this.cart.initCart().subscribe(() => {
      event.target.complete();
    });
  }

  loadSummary() {
    this.loading = true;
    this.shared
      .post<Checkout>("checkout/resume", {
        sessionId: this.getnet.sessionId,
        remainingValue: this.cart.data.total,
        points: 0,
      })
      .subscribe((res) => {
        this.loading = false;
        if (res && res.status) {
          this.checkout = res.data;
          if (res.data.cartItems && res.data.cartItems.length > 0) {
            this.checkout.cartProducts = this.cart.itemsToProducts(res.data.cartItems, true);
          }
          this.summaryItems = this.cart.getSummaryItems(this.checkout);
          const currentDelivery = this.checkout.delivery;
          this.isDeliveryExpress = currentDelivery?.key === "express";
        }
        //Redirecionar pro carrinho
        else if (res.httpStatus === 302) {
          this.handleRedirectCart(res.message);
        } else {
          this.checkout = undefined;
          this.system.showErrorAlert(res);
        }
      });
  }

  next() {
    if (this.checkout?.payment?.paymentMethod === "pix" && Number(this.checkout.amount) > 0) {
      this.handlePixPayment();
    } else {
      this.handlePayment();
    }
  }

  successRedirect(res) {
    this.cart.initCart().subscribe(() => {});
    this.openPage([
      `tabs/orders/${res.data.order}`,
      {
        back: "tabs/home",
      },
    ]);
  }

  checkPayment(res, loading, type: "payment" | "pix" = "payment") {
    this.shared.get<any>(`checkout/orders/${res.data.order}/check`).subscribe((resCheck) => {
      if (resCheck.httpStatus === 200) {
        loading.dismiss();
        if (type === "payment") {
          this.successRedirect(res);
        } else {
          this.successPixRedirect(res);
        }
      } else if (resCheck.httpStatus === 201) {
        setTimeout(() => {
          this.checkPayment(res, loading, type);
        }, 2000);
      } else if (resCheck.httpStatus === 302) {
        loading.dismiss();
        this.handleRedirectCart(resCheck.message);
      } else {
        loading.dismiss();
        this.system.showAlert("warn", "Atenção", resCheck.message ? resCheck.message : "Não foi possível concluir sua solicitação", "Ok");
      }
    });
  }

  async handlePayment() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared
      .post<any>(
        "checkout/resume/payment",
        {
          sessionId: this.getnet.sessionId,
        },
        false,
        true,
      )
      .subscribe((res) => {
        //Frete convencional (aprovação imediata)
        if (res.status && res.data && res.data.order && !this.isDeliveryExpress) {
          loading.dismiss();
          this.successRedirect(res);
        }
        //Frete expresso (aprovação condicionada ao check)
        else if (res.status && res.data && res.data.order && this.isDeliveryExpress) {
          if (this.system.enableCheckOrder) {
            this.checkPayment(res, loading, "payment");
          } else {
            loading.dismiss();
            this.successRedirect(res);
          }
        }
        //Redirecionar pro carrinho
        else if (res.httpStatus === 302 && res.message) {
          loading.dismiss();
          this.handleRedirectCart(res.message);
        }
        //App em manuntenção
        else if (!res.status && res.httpStatus === 200) {
          loading.dismiss();
          this.system.showAlert("warn", "Atenção", "Não foi possível concluir sua solicitação, entre em contato com o suporte em caso de duvidas.", "Ok");
        }
        //Error genérico
        else {
          loading.dismiss();
          this.system.showAlert(
            "warn",
            "Atenção",
            res.message ? res.message : "Não foi possível efetuar o pagamento. Verifique novamente ou selecione uma nova forma de pagamento!",
            "Selecionar forma de pagamento",
            null,
            "Cancelar pedido",
            () => {
              this.askCancelCheckout();
            },
          );
        }
      });
  }

  async handleRedirectCart(message) {
    this.system.showAlert("none", "Atenção", message, "Voltar para o carrinho", async () => {
      const loading = await this.system.loadingCtrl.create({});
      loading.present();
      this.cart.initCart().subscribe(() => {
        loading.dismiss();
        if (this.shared.web) {
          this.openCartWeb();
        } else {
          this.shared.navCtrl.navigateBack("tabs/cart");
        }
      });
    });
  }

  async openCartWeb() {
    this.openPage("/tabs/home");
    const modal = await this.system.modalCtrl.create({
      component: CartContentComponent,
      cssClass: "right-web",
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "backdrop") {
        this.system.closeModal$.next();
      }
    });
  }

  successPixRedirect(res) {
    this.cart.initCart().subscribe(() => {
      this.openPixModal(res.data, {});
    });
  }

  async handlePixPayment() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.post<Pix>("checkout/resume/generate-pix", {}, false, true).subscribe((res) => {
      //Frete convencional (aprovação imediata)
      if (res.status && res.data && res.data.order && !this.isDeliveryExpress) {
        loading.dismiss();
        this.successPixRedirect(res);
      }
      //Frete expresso (aprovação condicionada ao check)
      else if (res.status && res.data && res.data.order && this.isDeliveryExpress) {
        if (this.system.enableCheckOrder) {
          this.checkPayment(res, loading, "pix");
        } else {
          loading.dismiss();
          this.successPixRedirect(res);
        }
      }
      //Redirecionar pro carrinho
      else if (res.httpStatus === 302) {
        loading.dismiss();
        this.handleRedirectCart(res.message);
      }
      //App em manuntenção
      else if (!res.status && res.httpStatus === 200) {
        this.system.showAlert("warn", "Atenção", "Não foi possível concluir sua solicitação, entre em contato com o suporte em caso de duvidas.", "Ok");
      }
      //Error genérico
      else {
        loading.dismiss();
        this.system.showAlert(
          "warn",
          "Atenção",
          res.message ? res.message : "Não foi possível efetuar o pagamento com PIX. Verifique novamente ou selecione uma nova forma de pagamento!",
          "Selecionar forma de pagamento",
          null,
          "Cancelar pedido",
          () => {
            this.askCancelCheckout();
          },
        );
      }
    });
  }

  async openPixModal(pix: Pix, payload?: any) {
    const modal = await this.system.modalCtrl.create({
      component: PixComponent,
      componentProps: {
        pix,
        payload,
        type: "checkout",
      },
      backdropDismiss: false,
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.data && res.data.order) {
        this.cart.initCart().subscribe(() => {});
        this.openPage([
          `tabs/orders/${res.data.order}`,
          {
            back: "tabs/home",
          },
        ]);
      }
    });
  }

  askCancelCheckout() {
    this.system.showAlert(
      "none",
      "Atenção",
      "Você tem certeza que gostaria de cancelar seu pedido?",
      "Não, voltar ao pedido",
      () => {},
      "Sim, cancelar pedido",
      () => {
        this.cancelCheckout();
      },
    );
  }

  async cancelCheckout() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.delete("checkout/carts").subscribe((res) => {
      if (res.status) {
        this.cart.initCart().subscribe(() => {
          this.system.showToast("Seu pedido foi cancelado");
          loading.dismiss();
          if (this.shared.web) {
            this.openCartWeb();
          } else {
            this.shared.navCtrl.navigateBack("tabs/cart");
          }
        });
      } else {
        loading.dismiss();
        this.system.showErrorAlert(res);
      }
    });
  }

  copyPix() {
    this.copyClipboard("Teste de PIX copiado", "Seu PIX foi copiado");
  }
}
