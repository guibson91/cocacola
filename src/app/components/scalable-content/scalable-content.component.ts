import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Product, ScalablePrice } from "src/app/models/product";

@Component({
  selector: "app-scalable-content",
  templateUrl: "./scalable-content.component.html",
  styleUrls: ["./scalable-content.component.scss"],
})
export class ScalableContentComponent extends BaseComponent implements OnInit {
  @Input({ required: true }) product: Product;
  @Input({ required: true }) scalablePrice: ScalablePrice;
  @Input({ required: true }) index: number;
  @Input() fullWidth: boolean;

  constructor() {
    super();
  }

  ngOnInit() {}

  selectScalablePrice(scalablePrice: ScalablePrice, index: number) {
    if (this.router.url !== "/tabs/catalog/products/details") {
      return;
    }
    if (!this.product.scalablePrices) {
      return;
    }
    if (!scalablePrice.active) {
      for (let i = 0; i < this.product.scalablePrices.length; i++) {
        if (i === index) {
          this.product.scalablePrices[i].active = true;
        } else {
          this.product.scalablePrices[i].active = false;
        }
      }
      this.product.inputQuantity = scalablePrice.minimumQuantity ? scalablePrice.minimumQuantity : 0;
      this.cart.currentProduct$.next(this.product);
      if (this.product.quantity === 0) {
        this.cart.addItem(this.product, true, false);
      } else {
        this.cart.updateItem(this.product, true);
      }
    }
  }
}
