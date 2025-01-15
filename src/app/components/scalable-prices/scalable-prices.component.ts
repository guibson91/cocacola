import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Product, ScalablePrice } from "src/app/models/product";
import { Subscription } from "rxjs";

@Component({
  selector: "app-scalable-prices",
  templateUrl: "./scalable-prices.component.html",
  styleUrls: ["./scalable-prices.component.scss"],
})
export class ScalablePricesComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() details: boolean;

  product: Product;

  subscription: Subscription;

  constructor() {
    super();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.subscription = this.cart.currentProduct$.subscribe((product) => {
      if (product) {
        this.product = product;
        this.ref.detectChanges();
      }
    });
  }
}
