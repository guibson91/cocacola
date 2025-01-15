import { Component, Input } from "@angular/core";
import { SummaryItem } from "@app/models/cart";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-order-summary-points",
  templateUrl: "./order-summary-points.component.html",
  styleUrls: ["./order-summary-points.component.scss"],
})
export class OrderSummaryPointsComponent extends BaseComponent {
  @Input({ required: true }) items: SummaryItem[];

  constructor() {
    super();
  }
}
