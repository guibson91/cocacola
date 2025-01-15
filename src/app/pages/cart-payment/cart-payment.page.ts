import { BaseComponent } from "src/app/components/base/base.component";
import { Card, Payment } from "src/app/models/payment";
import { CardCreateComponent } from "src/app/components/modals/card-create/card-create.component";
import { CardSelectComponent } from "src/app/components/modals/card-select/card-select.component";
import { Cart } from "src/app/models/cart";
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { Delivery } from "src/app/models/delivery";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { patternCardMask, patternCpfCnpjMask, patternDateMask } from "src/app/util/masks";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cart-payment",
  templateUrl: "./cart-payment.page.html",
  styleUrls: ["./cart-payment.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CartPaymentPage extends BaseComponent implements OnInit, OnDestroy {
  selectedDeliveryHash?: string;

  cartData: Cart;

  subscription: Subscription;

  selectedPayment?: Payment;
  selectedCard?: Card;

  loadingDeliveries;
  loadingInstallments;

  readonly cardMask: MaskitoOptions = patternCardMask;
  readonly dateMask: MaskitoOptions = patternDateMask;
  readonly cpfCnpjMask: MaskitoOptions = patternCpfCnpjMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor() {
    super();
  }

  ionViewWillEnter() {
    this.cart.initCart().subscribe(() => {
      console.log("Carrinho: ", this.cart.data);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleRefresh(event) {
    this.cart.initCart().subscribe(() => {
      event.target.complete();
    });
  }

  ngOnInit() {
    this.subscription = this.cart.updateCart$.subscribe((cartData) => {
      this.cartData = cartData;
      if (this.cartData.deliveries) {
        const currentDelivery = (this.cartData.deliveries || []).find((d) => d.active);
        this.selectedDeliveryHash = currentDelivery?.hash;
        this.ref.detectChanges();
      }
    });
  }

  selectPayment(event) {
    if (event && event.payment) {
      this.selectedPayment = event.payment;
      if (!event.notUpdateCart) {
        this.handleSelectedPayment();
      }
    } else {
      this.selectedPayment = undefined;
    }
  }

  changeInstallments(event?) {
    if (event && event.card && event.payment) {
      this.selectedCard = event.card;
      this.selectedPayment = event.payment;
      this.handleSelectedPayment();
    }
  }

  handleSelectedPayment() {
    if (this.selectedPayment && this.selectedPayment.paymentMethod === "credit" && !this.selectedCard) {
      return;
    }
    this.loadingInstallments = true;
    this.shared
      .put<Cart>("checkout/carts/payment", {
        paymentCondition: this.selectedPayment ? this.selectedPayment.paymentCondition : "",
        card: this.selectedCard ? this.selectedCard : [],
      })
      .subscribe((res) => {
        this.loadingInstallments = false;
        if (res && res.status) {
          this.cart.data = res.data;
          this.cart.updateAllPaymentDescription();
        } else {
          console.error("Error ao atualizar carrinho: ", res);
          this.system.showErrorAlert(res);
        }
      });
  }

  changeDelivery(delivery: Delivery) {
    if (delivery.hash === this.selectedDeliveryHash) {
      return;
    } else {
      this.selectedDeliveryHash = delivery.hash;
      this.ref.detectChanges();
      this.loadingDeliveries = true;
      this.shared.put<Cart>("checkout/carts/delivery", { hash: delivery.hash }).subscribe((res) => {
        this.loadingDeliveries = false;
        if (res.status) {
          this.cart.data = res.data;
        } else {
          this.system.showErrorAlert(res);
        }
      });
    }
  }

  async next() {
    this.shared.navCtrl.navigateForward("tabs/cart/payment/summary");
  }

  async openCreditModal() {
    const modal = await this.system.modalCtrl.create({
      component: CardSelectComponent,
      backdropDismiss: false,
    });
    modal.present();
  }

  async openModal() {
    const modal = await this.system.modalCtrl.create({
      component: CardCreateComponent,
      backdropDismiss: false,
      componentProps: {
        doubleModal: true,
      },
    });
    modal.present();
  }
}
