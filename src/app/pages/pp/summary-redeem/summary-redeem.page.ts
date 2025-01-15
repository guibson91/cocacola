import { BaseComponent } from "@app/components/base/base.component";
import { Card, Payment } from "@app/models/payment";
import { Cart, Checkout } from "@app/models/cart";
import { CartContentComponent } from "@app/components/modals/cart-content/cart-content.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "@app/components/components.module";
import { Customer } from "@app/models/customer";
import { Delivery } from "@app/models/delivery";
import { FormsModule } from "@angular/forms";
import { GetnetService } from "@app/services/getnet.service";
import { IonicModule, LoadingController } from "@ionic/angular";
import { combineLatest, Subscription } from "rxjs";

@Component({
  selector: "app-summary-redeem",
  templateUrl: "./summary-redeem.page.html",
  styleUrls: ["./summary-redeem.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class SummaryRedeemPage extends BaseComponent implements OnInit {
  errorOutOfRange = false;
  value: any = "";
  points: any = "";
  rangeValue: number = 0;
  selectedDeliveryHash?: string;
  cartData: Cart;
  loadingDeliveries = false;
  loadingInstallments = false;
  loadingReedem = false;
  loading?: boolean;

  subscription: Subscription;

  isEmpty: boolean = true;

  currentDelivery?: Delivery;

  cards: Card[];

  min?: number;
  max?: number;

  customer: Customer;

  installments: Payment[] = [];
  cardSelected?: Card;
  paymentCondition?: string;
  checkout?: Checkout;
  summaryItems: any[];

  constructor(
    public loadingCtrl: LoadingController,
    public getnet: GetnetService,
  ) {
    super();
  }

  ngOnInit() {
    this.loadCards();
    this.listenCart();
  }

  ionViewWillEnter() {
    if (this.cartData && this.cartData.cartItems && this.cartData.cartItems.length > 0 && this.cartData.isRedeemable) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
      this.openPage("tabs/pp");
    }
  }

  changeCard(ev) {
    const cardId = ev.detail.value;
    this.cardSelected = (this.cards || []).find((c) => c.id === cardId);

    this.handleSelectedPayment();
  }

  changeInstallment(event) {
    const paymentCondition = event.detail.value;
    this.paymentCondition = paymentCondition;

    this.handleSelectedPayment();
  }

  listenCart() {
    this.loading = true;
    this.subscription = combineLatest([this.cart.updateCart$, this.shared.customer$]).subscribe(([cartData, customer]) => {
      this.cartData = cartData;
      console.log("Carrinho atualizado: ", this.cartData);
      //Calc MAXIMUM points
      if (customer) {
        this.customer = customer;
        this.calcMaxPoints(Number(this.customer.balanceAvailable), Number(this.cartData.totalRedeemPoints));
        this.ref.detectChanges();
        if (!this.points) {
          this.changePoints(false);
        }
      }
      //Calc MINIMUM points
      if (this.cartData && this.cartData.minimumPoints) {
        this.min = Number(this.cartData.minimumPoints);
        if (!this.points) {
          this.points = this.min;
        }
      }

      if (this.cartData && this.cartData.paymentMethods && this.cartData.paymentMethods["credit"]) {
        this.installments = this.cartData.paymentMethods["credit"];
        const payment: Payment | undefined = this.cartData.paymentMethods["credit"].find((p) => p.active);
        if (payment) {
          this.paymentCondition = payment.paymentCondition;
        } else {
          this.paymentCondition = "";
        }
      }
      this.currentDelivery = this.cart.data.deliveries?.find((d) => d.active);
      if (this.currentDelivery) {
        this.selectedDeliveryHash = this.currentDelivery.hash;
      }
      if (this.cartData && this.cartData.cartItems && this.cartData.cartItems.length > 0 && this.cartData.isRedeemable) {
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
      // this.changePoints(false);
      this.loading = false;
      this.ref.detectChanges();
    });
  }

  calcMaxPoints(userPoints, totalPoints) {
    if (userPoints <= totalPoints) {
      this.max = userPoints;
    } else {
      this.max = totalPoints;
    }
  }

  async loadCards() {
    this.cards = [];
    this.shared.get<Card[]>("register/cards").subscribe((res) => {
      if (res && res.status) {
        this.cards = res.data;
      } else {
        this.cards = [];
      }
    });
  }

  handleRefresh(event) {
    this.cart.loadData().subscribe(() => {
      event.target.complete();
    });
  }

  editRedeem() {
    this.openPage("tabs/pp/cart-redeem");
  }

  focusPoints() {
    if (this.points == 0) {
      this.points = "";
    }
  }

  changeRange(event: CustomEvent) {
    const value = parseInt(event.detail.value);

    this.points = value;

    this.changePoints(true);
  }

  changePoints(fromRange = false) {
    if (!this.points) {
      this.points = 0;

      if (this.cartData.total) {
        this.value = (this.cartData.total / 100).toFixed(2);
        this.ref.detectChanges();
      }
      return;
    }
    if (this.points < 0) {
      this.points = 0;
    }
    const pointsNumber = parseInt(this.points);

    if (pointsNumber > this.customer.balanceAvailable) {
      this.errorOutOfRange = true;
      this.value = "";
    } else {
      this.errorOutOfRange = false;
      this.calcValueReais(pointsNumber);
    }
    if (!fromRange && this.max) {
      this.rangeValue = (this.points / this.max) * 100;
    }
  }

  calcValueReais(pointsNumber: number) {
    // this.value = (pointsNumber * this.factor).toFixed(2);
    const totalRedeemPoints = this.cartData.totalRedeemPoints ?? 0;
    let percentPoints = 0;
    if (totalRedeemPoints > 0) {
      percentPoints = (pointsNumber / totalRedeemPoints) * 100;
    }
    const percentMoney = 100 - percentPoints;

    if (this.cartData.total) {
      const centsValue = (this.cartData.total * percentMoney) / 100;
      const realValue = centsValue / 100;
      this.value = realValue.toFixed(2);
    }
  }

  async confirmRedeem() {
    // this.loading = true;

    if (this.value && Number(this.value) > 0 && !this.cardSelected) {
      this.system.showAlert("warn", "Atenção", "Selecione um cartão de crédito para efetuar o pagamento", "Ok");
      this.loading = false;
      return;
    }
    this.handleCheckout();
  }

  handleSelectedPayment() {
    if (!this.cardSelected || !this.paymentCondition) {
      console.error("Não existe cartão ou parcela selecionada");
      return;
    }
    this.loadingInstallments = true;
    this.ref.detectChanges();
    this.shared
      .put<Cart>("checkout/carts/payment", {
        paymentCondition: this.paymentCondition ? this.paymentCondition : "",
        card: this.cardSelected ? this.cardSelected : [],
        sessionId: this.getnet.sessionId,
      })
      .subscribe((res) => {
        this.loadingInstallments = false;
        if (res && res.status) {
          this.cart.data = res.data;
          this.calcValueReais(Number(this.points));
          // this.changePoints(false);
        } else {
          console.error("Error ao atualizar carrinho: ", res);
          this.system.showErrorAlert(res);
        }
      });
  }

  handleCheckout() {
    this.loading = true;
    this.shared
      .post<Checkout>("checkout/resume", {
        remainingValue: Number(this.value) * 100,
        points: this.points,
      })
      .subscribe((res) => {
        this.loading = false;

        if (res && res.status) {
          this.checkout = res.data;
          this.handlePayment();
        } else if (res.httpStatus === 302) {
          this.handleRedirectCart(res.message);
        } else {
          this.checkout = undefined;
          this.system.showErrorAlert(res);
        }
      });
  }

  async handlePayment() {
    if (this.loadingDeliveries || this.loadingInstallments) {
      return;
    }
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared
      .post<any>(
        "checkout/resume/payment",
        {
          sessionId: this.getnet.sessionId,
          remainingValue: Number(this.value) * 100,
          points: this.points,
        },
        false,
        true,
      )
      .subscribe((res) => {
        loading.dismiss();
        if (res.status && res.data && res.data.order) {
          this.cart.initCart().subscribe(() => {});
          this.openPage([
            `tabs/pp`,
            {
              back: "tabs/home",
            },
          ]);
        }
        //Redirecionar pro carrinho
        else if (res.httpStatus === 302 && res.message) {
          this.handleRedirectCart(res.message);
        }
        //App em manuntenção
        else if (!res.status && res.httpStatus === 200) {
          this.system.showAlert("warn", "Atenção", "Não foi possível concluir sua solicitação, entre em contato com o suporte em caso de duvidas.", "Ok");
        }
        //Error genérico
        else {
          this.system.showAlert(
            "warn",
            "Atenção",
            res.message ? res.message : "Não foi possível efetuar o pagamento neste cartão de crédito. Verifique novamente ou selecione uma nova forma de pagamento!",
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
          this.shared.navCtrl.navigateBack("tabs/pp");
        }
      });
    });
  }

  async openCartWeb() {
    this.openPage("tabs/pp");
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
            this.shared.navCtrl.navigateBack("tabs/pp");
          }
        });
      } else {
        loading.dismiss();
        this.system.showErrorAlert(res);
      }
    });
  }
}
