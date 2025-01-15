import { Component, EventEmitter, OnInit, Output, effect } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { ProductAttribute } from "src/app/models/product";

@Component({
  selector: "app-filter-products-content",
  templateUrl: "./filter-products-content.component.html",
  styleUrls: ["./filter-products-content.component.scss"],
})
export class FilterProductsContentComponent extends BaseComponent {
  flavors?: ProductAttribute[];

  selectedFlavor?: ProductAttribute;

  @Output() close = new EventEmitter();

  constructor() {
    super();
    effect(() => {
      this.flavors = this.cart.flavors();
    });
  }

  cleanFilter() {
    this.selectedFlavor = undefined;
    this.cart.currentFlavor = null;
    this.close.emit();
  }

  filter() {
    if (this.selectedFlavor) {
      this.cart.currentFlavor = this.selectedFlavor;
    }
    this.close.emit();
  }
}
