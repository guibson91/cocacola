import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Product } from "src/app/models/product";

@Component({
  selector: "app-product-detail-header",
  templateUrl: "./product-detail-header.component.html",
  styleUrls: ["./product-detail-header.component.scss"],
})
export class ProductDetailHeaderComponent extends BaseComponent {
  product?: Product;
  @Input() showImage = true;
  @Input() isPP = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.cart.currentProduct$.subscribe((product) => {
      this.product = product;
    });
  }
}
