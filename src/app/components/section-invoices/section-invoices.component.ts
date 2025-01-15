import { Invoice } from "src/app/models/bankSlip";
import { BaseComponent } from "../base/base.component";
import { Component, Input, OnInit } from "@angular/core";
import { Loan, RequestedCredit } from "src/app/models/loan";
import { LoanDetailComponent } from "../modals/loan-detail/loan-detail.component";

@Component({
  selector: "app-section-invoices",
  templateUrl: "./section-invoices.component.html",
  styleUrls: ["./section-invoices.component.scss"],
})
export class SectionInvoicesComponent extends BaseComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() label: string;
  @Input() type: "payment-slip" | "loan";
  invoices?: Invoice[];

  errorMessage;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.load();
  }

  async load() {
    this.invoices = undefined;
    const endpoint = this.type === "payment-slip" ? "debt/bank-slip" : this.type === "loan" ? "debt/loans" : null;
    if (!endpoint) {
      return;
    }
    this.shared.get<Invoice[] | Loan>(endpoint).subscribe((res) => {
      if (res.status && res.data) {
        if (this.type === "loan") {
          this.handleLoan(res.data as Loan);
        } else if (this.type === "payment-slip") {
          this.handlePaymentSlip(res.data as Invoice[]);
        }
      } else {
        this.invoices = [];
        this.errorMessage = res.message ? res.message : `Ocorreu um erro ao buscar seus ${this.type === "payment-slip" ? "boletos" : "financiamentos"}`;
        this.system.showErrorAlert(res);
      }
    });
  }

  handlePaymentSlip(data: Invoice[]) {
    this.invoices = data ? data : [];
    if (this.invoices.length === 0) {
      this.errorMessage = "Você não possui boletos pendentes";
    }
  }

  handleLoan(data: Loan) {
    const requestedCreditHistory: RequestedCredit[] = data ? data.requestedCreditHistory : [];
    if (requestedCreditHistory && requestedCreditHistory.length > 0) {
      this.invoices = requestedCreditHistory
        .filter((credit) => credit && credit.creditId)
        .map((credit) => {
          return {
            code: credit.creditId,
            invoiceValue: credit.loan.totalAmount,
            dueDate: credit.loan.firstDueDate,
            details: credit,
          };
        });
    } else {
      this.invoices = [];
      this.errorMessage = "Você não possui financiamentos";
    }
  }

  openDocument(invoice: Invoice) {
    if (!this.type) {
      return console.error(`Type não definido`);
    }
    switch (this.type) {
      case "payment-slip":
        this.openPage(`tabs/menu/payment-slip/${invoice.id}`);
        break;
      case "loan":
        this.openHistoricModal(invoice);
        break;
      default:
        console.error(`Type ${this.type} não configurado`);
        break;
    }
  }

  async openHistoricModal(invoice: Invoice) {
    const modal = await this.system.modalCtrl.create({
      component: LoanDetailComponent,
      backdropDismiss: false,
      componentProps: {
        invoice,
      },
    });
    modal.present();
  }
}
