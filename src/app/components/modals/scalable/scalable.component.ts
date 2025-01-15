import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Product } from "src/app/models/product";
import { Subscription } from "rxjs";

@Component({
  selector: "app-scalable",
  templateUrl: "./scalable.component.html",
  styleUrls: ["./scalable.component.scss"],
})
export class ScalableComponent extends BaseModalComponent implements OnInit, OnDestroy {
  product?: Product;

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
