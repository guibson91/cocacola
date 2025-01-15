import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-suggested-order",
  templateUrl: "./suggested-order.component.html",
  styleUrls: ["./suggested-order.component.scss"],
})
export class SuggestedOrderComponent extends BaseComponent implements OnInit {
  @Input() label = "Produto Sugerido";
  @Input() labelSize = "1.4em";
  isPP = false;

  get recommendedProducts() {
    return this.cart.recommendedProducts();
  }

  get recommendedPointsProducts() {
    return this.cart.recommendedPointsProducts();
  }

  constructor() {
    super();
  }

  ngOnInit() {
    this.isPP = this.handleIsPP();
  }

  ionViewWillEnter() {
    this.isPP = this.handleIsPP();
  }
}
