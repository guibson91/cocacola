import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "src/app/components/components.module";
import { BaseComponent } from "src/app/components/base/base.component";
import { ParamMap } from "@angular/router";
import { Invoice } from "src/app/models/bankSlip";

@Component({
  selector: "app-payment-slip-detail",
  templateUrl: "./payment-slip-detail.page.html",
  styleUrls: ["./payment-slip-detail.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class PaymentSlipDetailPage extends BaseComponent implements OnInit {
  invoice?: Invoice;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const id = paramMap.get("id");

      if (!id) {
        this.system.showAlert("none", "Atenção", "Página só pode ser exibida com id do boleto", "Voltar", () => {
          this.back();
        });
      } else {
        this.loadPaymentDetails(id);
      }
    });
  }

  loadPaymentDetails(id: string) {
    this.invoice = undefined;
    this.shared.get<Invoice>(`debt/bank-slip?bankSlipId=${id}`).subscribe((res) => {
      if (res.status && res.data) {
        this.invoice = res.data;
      } else {
        this.invoice = {};
        this.system.showErrorAlert(res);
      }
    });
  }

  copyBarcode() {
    if (this.invoice && this.invoice.barCode) {
      this.copyClipboard(this.invoice.barCode, "Código de barras copiado");
    } else {
      this.system.showToast("Código de barras não cadastrado");
    }
  }

  openPaymentSlip() {
    if (this.invoice && this.invoice.file) {
      this.link.openPDF(this.invoice.file);
    } else {
      this.system.showToast("Boleto não cadastrado");
    }
  }
}
