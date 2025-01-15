import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Pix } from "src/app/models/pix";

const WAIT_TIME = 1000 * 60 * 15; //15min
@Component({
  selector: "app-pix",
  templateUrl: "./pix.component.html",
  styleUrls: ["./pix.component.scss"],
})
export class PixComponent extends BaseModalComponent implements OnInit, OnDestroy {
  time = WAIT_TIME;

  intervalId: any;

  @Input({ required: true }) pix: Pix;
  @Input() payload: any;
  @Input() title = "Pedido feito!";
  @Input({ required: true }) type: "checkout" | "debt" | "sfcoke" | "order";
  @Input() orderId;

  isAlive = true;

  pixWasCopied = false;

  resPix;

  constructor() {
    super();
  }

  ngOnInit() {
    this.checkPixPayment();
    setTimeout(() => {
      this.startCountdown();
    }, 500);
    setTimeout(() => {
      if (this.isAlive) {
        this.checkPixPayment();
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
    clearInterval(this.intervalId);
  }

  checkPixPayment() {
    if (!this.isAlive) {
      return;
    }
    if (this.pix && this.pix._id) {
      this.shared
        .get<Pix>(`${this.type === "debt" ? "debt" : this.type === "sfcoke" ? "checkout/pay-sfcoke" : "checkout/resume"}/check-pix?pixId=${this.pix._id}`)
        .subscribe((res) => {
          if (!this.isAlive) {
            return;
          }
          const resPix = res.data;
          this.resPix = resPix;
          if (resPix.status === "EXPIRED" || resPix.status === "DENIED") {
            this.system.showAlert("none", "Atenção", "O PIX expirou. Clique abaixo para renovar o PIX", "Renovar PIX", () => {
              this.time = 0;
              this.renewPix();
            });
          } else if (resPix.status === "APPROVED") {
            this.isAlive = false;
            this.closeModal("success", resPix);
            this.system.showAlert("none", "Pronto", "O seu PIX foi pago com sucesso", "Voltar", () => {});
          } else {
            setTimeout(() => {
              this.checkPixPayment();
            }, 3000);
          }
        });
    } else {
      console.error("Código PIX inválido");
      this.system.showAlert("none", "Atenção", "O PIX gerado foi inválido. Por favor, tente novamente.", "Voltar", () => {
        this.closeModal();
      });
    }
  }

  copyPix() {
    if (this.pix && this.pix.copyAndPaste) {
      this.pixWasCopied = true;
      this.copyClipboard(this.pix.copyAndPaste, "Seu PIX foi copiado");
    } else {
      this.pixWasCopied = false;
      this.system.showToast("Código de PIX não disponível");
    }
  }

  startCountdown() {
    this.time = WAIT_TIME;
    //garantir que não há interval em memória antes de criar um novo
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.time > 0) {
        this.time -= 1000; // reduce time by 1 second
      } else {
        clearInterval(this.intervalId);
        this.system.showAlert("none", "Atenção", "O PIX expirou. Clique abaixo para renovar o PIX", "Renovar PIX", () => {
          this.time = 0;
          this.renewPix();
        });
      }
    }, 1000);
  }

  renewPix() {
    let endpoint;
    switch (this.type) {
      case "debt":
        endpoint = "debt/get-pix";
        break;
      case "sfcoke":
        endpoint = "checkout/pay-sfcoke/generate-pix";
        break;
      case "checkout":
        endpoint = "checkout/resume/generate-pix";
        break;
      case "order":
        endpoint = `checkout/orders/${this.orderId}/generate-pix`;
        break;
      default:
        this.system.showErrorAlert(new Error("Tipo não identificado"));
        return;
    }
    this.shared.post<Pix>(endpoint, this.payload ? this.payload : {}).subscribe((res) => {
      if (res.status) {
        this.pix = res.data;
        this.startCountdown();
        this.system.showToast("Seu PIX foi renovado");
      } else {
        clearInterval(this.intervalId);
      }
    });
  }

  get formattedTime() {
    let minutes = Math.floor(this.time / 60000);
    let seconds = (this.time % 60000) / 1000;
    return `${minutes}:${seconds.toFixed(0).padStart(2, "0")}`;
  }
}
