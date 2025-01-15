import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { BaseComponent } from "src/app/components/base/base.component";
import { ParamMap } from "@angular/router";
import { convertDecimal } from "src/app/util/util";
import { Card, PaymentCondition, PaymentFormSap, PaymentMethod } from "src/app/models/payment";
import { Subscription } from "rxjs";
import { PixComponent } from "src/app/components/modals/pix/pix.component";
import { GetnetService } from "src/app/services/getnet.service";

@Component({
  selector: "app-sfcoke-payment",
  templateUrl: "./sfcoke-payment.page.html",
  styleUrls: ["./sfcoke-payment.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class SfcokePaymentPage extends BaseComponent implements OnInit {
  items: {
    label: string;
    description?: string;
    value?: number;
  }[] = [];

  qrcode: string;
  clientId: string;
  sellerId: string;
  sector: string;
  orderId: string;
  date: string;
  paymentCondition: string;
  paymentForm: PaymentFormSap;
  paymentFormName: string;
  installments: number;
  totalValue: number;

  payment: PaymentCondition;
  selectedCard: Card;

  subscriptionBackButton: Subscription;

  constructor(public getnet: GetnetService) {
    super();
  }

  ngOnDestroy(): void {
    if (this.subscriptionBackButton) {
      this.subscriptionBackButton.unsubscribe();
    }
  }

  initBackButton() {
    this.subscriptionBackButton = this.shared.platform.backButton.subscribeWithPriority(100, async () => {
      this.back();
    });
  }

  ngOnInit() {
    this.initBackButton();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const qrcode = paramMap.get("qrcode");
      if (!qrcode) {
        this.system.showAlert("none", "Atenção", "QR Code é obrigatório", "Entendi", () => {
          this.system.navCtrl.navigateRoot("tabs/home");
        });
        return;
      }
      this.qrcode = qrcode;
      const array = qrcode.split(";");
      this.handleQrcode(array);
    });
  }

  handleQrcode(array: string[]) {
    this.clientId = array[0];
    this.sellerId = array[1];
    this.sector = array[2];
    this.orderId = array[3];
    this.date = array[4];
    this.paymentCondition = array[5];
    this.paymentForm = this.paymentCondition[0] ? (this.paymentCondition[0].toUpperCase() as PaymentFormSap) : ("" as PaymentFormSap);

    switch (this.paymentForm) {
      case "X":
        this.paymentFormName = "Crédito";
        break;
      case "Y":
        this.paymentFormName = "Débito";
        break;
      case "I":
        this.paymentFormName = "Empréstimo";
        break;
      case "N":
        this.paymentFormName = "PIX";
        break;
    }

    if (this.paymentForm !== "X" && this.paymentForm !== "N") {
      this.system.showAlert("none", "Atenção", "A forma de pagamento informada não foi liberada para pagamento via QR Code", "Entendi", () => {
        this.system.navCtrl.navigateRoot("tabs/home");
      });
      return;
    }

    this.installments = this.paymentForm === "X" ? this.getInstallments() : 0;
    this.totalValue = convertDecimal(array[7]);
    this.payment = this.getPaymentCondition();
    this.updateInformations();
  }

  override back() {
    this.system.navCtrl.navigateBack("tabs/menu/financial");
  }

  updateInformations() {
    this.items = [
      {
        label: "Código PV",
        description: this.clientId,
      },
      {
        label: "Código do Vendedor",
        description: this.sellerId,
      },
      {
        label: "Código do Setor",
        description: this.sector,
      },
      {
        label: "Data do pedido",
        description: this.date,
      },
      {
        label: "Valor total",
        value: this.totalValue,
      },
    ];
  }

  selectPayment(ev: any) {}

  updatePayment(ev: any) {
    if (ev && ev.card) {
      this.selectedCard = ev.card;
    }
  }

  getPaymentCondition(): PaymentCondition {
    const payment: PaymentCondition = {};
    const totalValueCents = this.totalValue * 100;
    if (this.paymentForm === "X") {
      payment["credit"] = [
        {
          active: true,
          installments: this.installments,
          partialAmount: Math.round((totalValueCents / this.installments) * 100) / 100,
          totalAmount: totalValueCents,
          paymentCondition: this.paymentCondition,
          paymentMethod: this.getPaymentMethod(),
          paymentMethodDescription: "Cartão de crédito",
        },
      ];
    } else if (this.paymentForm === "N") {
      payment["pix"] = {
        active: true,
        partialAmount: totalValueCents,
        totalAmount: totalValueCents,
        paymentCondition: this.paymentCondition,
        paymentMethod: this.getPaymentMethod(),
        paymentMethodDescription: "PIX",
      };
    } else {
      console.error("Forma de pagamento não autorizada");
    }
    return payment;
  }

  getPaymentMethod(): PaymentMethod {
    if (this.paymentForm === "X") {
      return "credit";
    }
    if (this.paymentForm === "N") {
      return "pix";
    } else {
      console.error("Forma de pagamento não autorizada");
      return "";
    }
  }

  getInstallments(): number {
    const justNumbers = this.paymentCondition.replace(/\D/g, "");

    return justNumbers ? Number(justNumbers) : 0;
  }

  async finishPayment() {
    if (this.paymentForm === "X") {
      this.handleCreditPayment();
    }
    if (this.paymentForm === "N") {
      this.handlePixPayment();
    } else {
      console.error("Forma de pagamento não autorizada");
    }
  }

  private async handleCreditPayment() {
    const totalValueCents = this.totalValue * 100;
    const payload = {
      payment: {
        card: { ...this.selectedCard, installments: this.installments },
        installments: this.installments,
        subtotal: totalValueCents,
        totalValue: totalValueCents,
      },
      clientId: this.clientId,
      qrCode: this.qrcode,
      orderId: this.orderId,
      sessionId: this.getnet.sessionId,
    };

    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.post("checkout/pay-sfcoke", payload).subscribe((res) => {
      loading.dismiss();

      if (res.status) {
        this.system.showAlert("success", "Pronto", "Seu pagamento foi realizado com sucesso", "Voltar", () => {
          this.back();
        });
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }

  private async handlePixPayment() {
    const totalValueCents = this.totalValue * 100;
    const payload = {
      payment: {
        subtotal: totalValueCents,
        totalValue: totalValueCents,
      },
      clientId: this.clientId,
      qrCode: this.qrcode,
      orderId: this.orderId,
      sessionId: this.getnet.sessionId,
    };
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.post("checkout/pay-sfcoke/generate-pix", payload).subscribe((res) => {
      loading.dismiss();
      if (res.status) {
        this.openPixModal(res.data, payload);
      } else {
        this.system.showAlert("none", "Atenção", res.message ? res.message : "Falha ao gerar PIX. Tente outro método de pagamento", "Voltar ao pagamento");
      }
    });
  }

  async openPixModal(pix, payload) {
    const modal = await this.system.modalCtrl.create({
      component: PixComponent,
      componentProps: {
        pix,
        payload,
        title: "Efetuar pagamento",
        type: "sfcoke",
      },
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "success") {
        this.openPage("tabs/home");
      }
    });
  }
}
