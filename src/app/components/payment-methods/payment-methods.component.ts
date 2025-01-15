import { BaseComponent } from "../base/base.component";
import { CardSelectComponent } from "../modals/card-select/card-select.component";
import { Cart } from "src/app/models/cart";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { IonAccordionGroup } from "@ionic/angular";
import { Payment, PaymentCondition } from "src/app/models/payment";
import { Subscription } from "rxjs";

@Component({
  selector: "app-payment-methods",
  templateUrl: "./payment-methods.component.html",
  styleUrls: ["./payment-methods.component.scss"],
})
export class PaymentMethodsComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild("accordionGroup", { static: true }) accordionGroup: IonAccordionGroup;

  @Input() paymentConditions?: PaymentCondition;
  @Input() loading = false;
  @Input() disabledAccordion = false;
  @Input() debts = false;
  @Output() update = new EventEmitter();
  @Output() selectPayment = new EventEmitter();

  selectedPayment?: Payment;
  selectedCard?: any;

  subscription?: Subscription;

  constructor() {
    super();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (!this.paymentConditions && !this.debts) {
      this.subscription = this.cart.updateCart$.subscribe((cart) => {
        this.handlePaymentConditions(cart);
        this.ref.detectChanges();
      });
    }
  }

  changePaymentGroup(ev: any) {
    if (!this.paymentConditions) {
      return;
    }
    const selectedValue = ev.detail.value;

    if (!selectedValue) {
      return;
    }
    if (selectedValue === "credit") {
      this.openCreditModal();
    } else {
      if (this.paymentConditions[selectedValue] && Array.isArray(this.paymentConditions[selectedValue])) {
        this.selectedPayment = this.paymentConditions[selectedValue][0];
      } else {
        this.selectedPayment = this.paymentConditions[selectedValue];
      }
    }
    this.ref.detectChanges();
    if (this.selectedPayment?.paymentMethod === "pix") {
      this.selectPayment.emit({ payment: this.selectedPayment });
    } else if (this.selectedPayment?.paymentMethod === "employees") {
      this.selectPayment.emit({ payment: this.selectedPayment });
    } else if (this.selectedPayment?.paymentMethod === "bankSlip") {
      this.selectPayment.emit({ payment: this.paymentConditions[selectedValue][0] });
    } else if (this.selectedPayment?.paymentMethod === "credit") {
      // this.selectPayment.emit({ payment: this.paymentConditions[selectedValue][0] });
    } else {
      console.error("Forma de pagamento não foi cadastrada", this.selectedPayment);
    }
  }

  openModalCard() {
    if (this.disabledAccordion && this.paymentConditions && this.paymentConditions["credit"]) {
      this.openCreditModal();
    }
  }

  handlePaymentConditions(cart: Cart) {
    const conditions = cart.paymentMethods;
    this.paymentConditions = undefined;
    if (conditions && conditions["pix"] && Array.isArray(conditions["pix"])) {
      conditions["pix"] = conditions["pix"][0];
    }
    if (conditions && conditions["employees"] && Array.isArray(conditions["employees"])) {
      conditions["employees"] = conditions["employees"][0];
    }
    if (conditions && conditions["pix"]) {
      conditions["pix"].paymentMethodDescription = "PIX";
    }
    this.paymentConditions = {
      ...conditions,
    };
    this.handleSelectedPayment();
  }

  handleSelectedPayment() {
    if (!this.paymentConditions) {
      return;
    }
    this.selectedPayment = undefined;
    //Verificando se PIX é pagamento ativo
    if (this.paymentConditions["pix"] && this.paymentConditions["pix"].active) {
      this.selectedPayment = this.paymentConditions["pix"];
      this.selectPayment.emit({ payment: this.selectedPayment, notUpdateCart: true });
      return;
    }
    //Verificando se Funcionário é pagamento ativo
    if (this.paymentConditions["employees"] && this.paymentConditions["employees"].active) {
      this.selectedPayment = this.paymentConditions["employees"];
      this.selectPayment.emit({ payment: this.selectedPayment, notUpdateCart: true });
      return;
    }
    //Verificando se crédito tem pagamento ativo
    if (this.paymentConditions["credit"] && !this.selectedPayment) {
      const active = this.paymentConditions["credit"].find((c) => c.active);
      if (active) {
        this.selectedPayment = active;
        this.selectPayment.emit({ payment: this.selectedPayment, notUpdateCart: true });
        return;
      }
    }
    //Verificando se Boleto tem pagamento ativo
    if (this.paymentConditions["bankSlip"] && !this.selectedPayment) {
      const active = this.paymentConditions["bankSlip"].find((b) => b.active);
      if (active) {
        this.selectedPayment = active;
        this.selectPayment.emit({ payment: this.selectedPayment, notUpdateCart: true });
        return;
      }
    }
  }

  toggleAccordion = () => {
    const nativeEl = this.accordionGroup;
    if (!this.selectedPayment) {
      console.error("Deveria ter pagamento selecionado!");
      return;
    }
    if (!nativeEl) {
      console.error("Deveria ter accordion element!");
      return;
    }
    if (nativeEl && nativeEl.value === this.selectedPayment.paymentMethod) {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = this.selectedPayment.paymentMethod;
    }
  };

  scrollToTop() {
    const el = document.getElementById("top-accordion");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  clickPayment(payment: Payment) {
    this.selectedPayment = payment;
    this.selectPayment.emit({ payment: this.selectedPayment });
    this.toggleAccordion();
  }

  async openCreditModal() {
    //Deve-se desmarcar pagamentos ao abrir modal de crédito
    this.selectPayment.emit({ payment: null, notUpdateCart: true });
    const modal = await this.system.modalCtrl.create({
      component: CardSelectComponent,
      backdropDismiss: false,
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res && res.data && res.data.card) {
        this.selectedCard = res.data.card;
        if (!this.disabledAccordion) {
          this.loading = true;
        }
        //Na seleção de cartão, definindo parcela 1x como default
        this.selectedPayment = this.paymentConditions && this.paymentConditions["credit"] ? this.paymentConditions["credit"][0] : undefined;
        this.update.emit({
          card: this.selectedCard,
          payment: this.selectedPayment,
        });
      } else {
        this.toggleAccordion();
      }
    });
  }
}
