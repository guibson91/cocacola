import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Component, Input, OnInit } from "@angular/core";
import { CreditLimit } from "@app/models/balance";
import { Order, OrderStatus } from "@app/models/order";
import { SummaryItem } from "@app/models/cart";

@Component({
  selector: "app-order-details-pp",
  templateUrl: "./order-details-pp.component.html",
  styleUrls: ["./order-details-pp.component.scss"],
})
export class OrderDetailsPpComponent extends BaseModalComponent implements OnInit {
  @Input() order!: Order;

  summaryItems: SummaryItem[] = [];

  finished = true;

  currentIndexStatus: 0 | 1 | 2 | 3 | 4;

  orderRating;

  loadingRating;

  creditLimit: CreditLimit;

  statusName: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.updateStatusName(this.order.status);
    if (this.order && this.order.cartItems) {
      this.order.cartProducts = this.cart.itemsToProducts(this.order.cartItems, true);
    }
    this.summaryItems = this.cart.getSummaryPointsItems(this.order);

    if (!this.summaryItems) {
      this.summaryItems = [];
    }
  }

  updateStatusName(status: OrderStatus) {
    if (!status) {
      throw new Error("Pedido deveria ter status");
    }
    switch (status) {
      case "pending":
        this.statusName = "Pendente";
        break;
      case "received":
        this.statusName = "Recebido";
        break;
      case "review":
        this.statusName = "Em análise";
        break;
      case "approved":
        this.statusName = "Faturado";
        break;
      case "shipped":
        this.statusName = "Em rota";
        break;
      case "delivered":
        this.statusName = "Entregue";
        break;
      case "returned":
        this.statusName = "Devolvido";
        break;
      default:
        console.error("Status do pedido não foi mapeado", status);
        break;
    }
  }
}
