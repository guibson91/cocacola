import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Order, OrderStatus } from "src/app/models/order";
import { PixComponent } from "src/app/components/modals/pix/pix.component";
import { RatingComponent } from "src/app/components/modals/rating/rating.component";
import { SummaryItem } from "src/app/models/cart";
import { Pix } from "src/app/models/pix";
import { catchError, of } from "rxjs";
import { CartContentComponent } from "src/app/components/modals/cart-content/cart-content.component";
import { CreditLimit } from "src/app/models/balance";

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.page.html",
  styleUrls: ["./order-detail.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class OrderDetailPage extends BaseComponent implements OnInit {
  labels = ["Pedido<br/>recebido", "Em<br/>análise", "Pedido<br/>confirmado", "Em rota<br/>de entrega", "Pedido<br/>entregue"];

  order: Order;

  summaryItems: SummaryItem[] = [];

  finished = true;

  backPage?: string;

  allowPixButton;

  orderId: string;

  currentIndexStatus: 0 | 1 | 2 | 3 | 4;

  orderRating;

  loadingRating;

  creditLimit: CreditLimit;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.orderId = id;
        this.loadOrder(id);
        this.getOrderRating();
      }
      const back = params.get("back");
      if (back) {
        this.backPage = back;
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.ref.detectChanges();
    });
  }

  async loadCreditLimit() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.get<CreditLimit>(`user/credit-limit`).subscribe((res) => {
      loading.dismiss();
      if (res && res.data) {
        const creditLimit = res.data;
        creditLimit.visitDate = new Date(creditLimit.visitDate);
        creditLimit.salesVisitDate = new Date(creditLimit.salesVisitDate);
        creditLimit.salesPlannerVisitDate = new Date(creditLimit.salesPlannerVisitDate);
        this.creditLimit = creditLimit;
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }

  getOrderRating() {
    this.loadingRating = true;
    this.shared.get<any>("checkout/order-nps/" + this.orderId).subscribe((res) => {
      this.loadingRating = false;
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          if (res.data.length > 0) {
            this.orderRating = res.data[res.data.length - 1].rating;
          }
        } else {
          this.orderRating = res.data.rating;
        }
      }
    });
  }

  handleRefresh(event) {
    this.loadOrder(this.orderId, event);
  }

  updateStatus(status: OrderStatus) {
    if (!status) {
      throw new Error("Pedido deveria ter status ativo");
    }
    switch (status) {
      case "received":
        this.currentIndexStatus = 0;
        break;
      case "review":
        this.currentIndexStatus = 1;
        break;
      case "approved":
        this.currentIndexStatus = 2;
        break;
      case "shipped":
        this.currentIndexStatus = 3;
        break;
      case "delivered":
        this.currentIndexStatus = 4;
        break;
      case "returned":
        console.info("Status returned não exibir tracking");
        this.currentIndexStatus = 1;
        break;
      default:
        this.currentIndexStatus = 1;
        console.error("Status do pedido não foi mapeado", status);
        break;
    }
  }

  async loadOrder(id: string, event?) {
    const loading = await this.system.loadingCtrl.create({});
    if (!event) {
      loading.present();
    }
    this.shared
      .get<Order>("checkout/orders/" + id)
      .pipe(
        catchError((err) => {
          console.error(err);
          if (!event) {
            loading.dismiss();
          }
          this.system.showErrorAlert(err);
          return of(null);
        }),
      )
      .subscribe((res) => {
        if (!event) {
          loading.dismiss();
        }
        if (event) {
          event.target.complete();
        }
        if (res && res.status) {
          this.order = res.data;
          this.ref.detectChanges();

          this.updateStatus(this.order.status);
          if (this.order && this.order.payment && this.order.payment.paymentMethod === "pix" && this.currentIndexStatus >= 0 && this.currentIndexStatus <= 2) {
            this.allowPixButton = true;
          } else {
            this.allowPixButton = false;
          }
          if (this.order && this.order.cartItems) {
            this.order.cartProducts = this.cart.itemsToProducts(this.order.cartItems, true);
          }
          this.summaryItems = this.cart.getSummaryItems(this.order, true);
        } else {
          this.system.showErrorAlert(res);
        }
      });
  }

  askCancelOrder() {
    this.system.showAlert(
      "none",
      "Atenção",
      "Você tem certeza que gostaria de cancelar seu pedido?",
      "Não, voltar ao pedido",
      () => {},
      "Sim, cancelar pedido",
      () => {
        this.cancelOrder();
      },
    );
  }

  async editOrder() {
    const id = "4ab23d65-3248-4ea9-8f99-7c87e02ec46f"; //@test diego
    // const id = "83df0a38-169e-4bc7-8e24-df62e5ee1548"; //@test Alexandre
    // const id = this.orderId;
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.post(`checkout/edit-order/${id}`, {}).subscribe((res) => {
      loading.dismiss();
      if (res && res.status && res.data) {
        this.cart.data = res.data;
        setTimeout(() => {
          if (this.shared.web) {
            this.openCartWeb();
          } else {
            this.openPage("tabs/cart");
          }
        }, 100);
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }

  async cancelOrder() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.delete(`checkout/orders/${this.orderId}/cancel`).subscribe((res) => {
      loading.dismiss();
      if (res.status) {
        this.system.showAlert(
          "none",
          "Pronto",
          "Seu pedido foi cancelado com sucesso!",
          "Voltar ao início",
          () => {
            if (this.order && this.order.order) {
              this.loadOrder(this.order.order)
                .then(() => {
                  this.openPage("tabs/home");
                })
                .catch(() => {
                  this.openPage("tabs/home");
                });
            } else {
              console.error("Atenção! O pedido não possui atributo order! Devemos notificar ao backend!");
              this.openPage("tabs/home");
            }
          },
          null,
          null,
          true,
        );
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }

  customBack() {
    if (this.backPage) {
      this.system.navCtrl.navigateRoot(this.backPage);
    } else {
      this.system.navCtrl.back();
    }
  }

  async rebuy() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.post(`checkout/remake-order/${this.order.order}`, {}).subscribe((res) => {
      loading.dismiss();
      if (res && res.status && res.data) {
        this.cart.data = res.data;
        setTimeout(() => {
          if (this.shared.web) {
            this.openCartWeb();
          } else {
            this.openPage("tabs/cart");
          }
        }, 100);
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }

  async openCartWeb() {
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

  async handlePixPayment() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.post<Pix>(`checkout/orders/${this.order.order}/generate-pix`, {}).subscribe((res) => {
      if (res.status && res.data) {
        loading.dismiss();
        this.openPixModal(res.data, {}, this.order.order);
      }
      //Error genérico
      else {
        loading.dismiss();
        this.system.showAlert("warn", "Atenção", res.message ? res.message : "Não foi possível gerar o pagamento com PIX.", "Voltar", null);
      }
    });
  }

  private async openPixModal(pix: Pix, payload: any, orderId: string) {
    const modal = await this.system.modalCtrl.create({
      component: PixComponent,
      componentProps: {
        pix,
        payload,
        type: "order",
        orderId,
      },
      backdropDismiss: false,
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "success") {
        this.loadOrder(orderId);
        this.getOrderRating();
      }
    });
  }

  async openRatingModal() {
    if (this.orderRating > 0) {
      return;
    }
    const modal = await this.system.modalCtrl.create({
      component: RatingComponent,
      backdropDismiss: false,
      componentProps: {
        order: this.order,
      },
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "success") {
        this.getOrderRating();
      }
    });
  }
}
