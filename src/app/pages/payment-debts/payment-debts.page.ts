import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { Debt } from "src/app/models/debt";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Payment, PaymentCondition } from "src/app/models/payment";
import { PixComponent } from "src/app/components/modals/pix/pix.component";
import { GetnetService } from "src/app/services/getnet.service";

@Component({
  selector: "app-payment-debts",
  templateUrl: "./payment-debts.page.html",
  styleUrls: ["./payment-debts.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class PaymentDebtsPage extends BaseComponent implements OnInit {
  debts: Debt[];
  paymentConditions: PaymentCondition;
  loadingDebts: boolean;
  loadingPaymentConditions: boolean;
  loadingPayment: boolean;
  selectedCard;
  selectedPayment: Payment;

  constructor(public getnet: GetnetService) {
    super();
  }

  ngOnInit(): void {
    this.loadDebts();
  }

  loadDebts() {
    this.loadingDebts = true;
    this.shared.get<{ debts: Debt[]; totalDebts: number }>(`debt`).subscribe((res) => {
      this.loadingDebts = false;
      if (res && res.status) {
        this.debts = res.data.debts;
      }
    });
  }

  get hasActiveDebts() {
    if (!this.debts || this.debts.length === 0) {
      return false;
    }
    return this.debts.filter((d) => d.selected).length > 0;
  }

  open2via() {
    this.openPage("tabs/menu/payment-slip");
  }

  changeDebts(event?) {
    const selectedDebts = this.debts.filter((d) => d.selected);
    if (event && event.card) {
      this.selectedCard = event.card;
    }
    this.loadingPaymentConditions = true;
    this.shared
      .post<PaymentCondition>(`debt/payments-conditions-debt`, {
        debts: selectedDebts.map((d) => d.detbId),
        brand: this.selectedCard ? this.selectedCard.brand : "",
      })
      .subscribe((res) => {
        this.loadingPaymentConditions = false;
        if (res && res.data) {
          this.paymentConditions = res.data;
        }
      });
  }

  selectPayment(event) {
    if (event && event.payment) {
      this.selectedPayment = event.payment;
    }
  }

  async finish() {
    if (!this.hasActiveDebts) {
      this.system.showAlert("none", "Atenção", "Você precisa selecionar pelo menos uma dívida", "Voltar");
    }
    this.loadingPayment = true;
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    const selectedDebts = this.debts.filter((d) => d.selected);
    const payload = {
      debts: selectedDebts.map((d) => d.detbId),
      brand: this.selectedCard ? this.selectedCard.brand : "",
      payment: this.selectedPayment ? this.selectedPayment : null,
      card: this.selectedCard ? this.selectedCard : null,
      sessionId: this.getnet.sessionId,
    };
    if (payload.card && payload.card.token) {
      payload.card.numberToken = payload.card.token;
    }

    if (this.selectedPayment.paymentMethod === "pix") {
      this.shared.post("debt/get-pix", payload).subscribe((res) => {
        this.loadingPayment = false;
        loading.dismiss();
        if (res.status) {
          this.openPixModal(res.data, payload);
        } else {
          this.system.showAlert("none", "Atenção", res.message ? res.message : "Falha ao gerar PIX. Tente outro método de pagamento", "Voltar ao pagamento");
        }
      });
    } else {
      this.shared.post("debt/pay-debts", payload).subscribe((res) => {
        this.loadingPayment = false;
        loading.dismiss();
        if (res.status) {
          this.system.showAlert(
            "default",
            "Pagamento realizado com sucesso",
            "Deseja realizar outro pagamento?",
            "Sim",
            () => {
              this.loadDebts();
            },
            "Voltar ao início",
            () => {
              this.back();
            },
            true,
          );
        } else {
          this.system.showAlert("none", "Atenção", res.message ? res.message : "Falha no pagamento com cartão. Tente outro método de pagamento", "Voltar ao pagamento");
        }
      });
    }
  }

  async openPixModal(pix, payload) {
    const modal = await this.system.modalCtrl.create({
      component: PixComponent,
      componentProps: {
        pix,
        payload,
        title: "Efetuar pagamento",
        type: "debt",
      },
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "success") {
        this.system.showAlert(
          "default",
          "Pagamento realizado com sucesso",
          "Deseja realizar outro pagamento?",
          "Sim",
          () => {
            this.loadDebts();
          },
          "Voltar ao início",
          () => {
            this.back();
          },
          true,
        );
      }
    });
  }
}
