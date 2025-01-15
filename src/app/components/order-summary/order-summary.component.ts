import { Component, Input } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { SummaryItem } from "src/app/models/cart";

@Component({
  selector: "app-order-summary",
  templateUrl: "./order-summary.component.html",
  styleUrls: ["./order-summary.component.scss"],
})
export class OrderSummaryComponent extends BaseComponent {
  @Input({ required: true }) items: SummaryItem[];

  constructor() {
    super();
  }
}
