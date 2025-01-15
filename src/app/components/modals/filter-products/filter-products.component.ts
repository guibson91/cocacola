import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Component, effect } from "@angular/core";
import { ProductAttribute } from "src/app/models/product";

@Component({
  selector: "app-filter-products",
  templateUrl: "./filter-products.component.html",
  styleUrls: ["./filter-products.component.scss"],
})
export class FilterProductsComponent extends BaseModalComponent {
  flavors?: ProductAttribute[];

  selectedFlavor?: ProductAttribute;

  constructor() {
    super();
    effect(() => {
      this.flavors = this.cart.flavors();
    });
  }

  cleanFilter() {
    this.cart.currentFlavor = null;
    this.closeModal();
  }

  filter() {
    if (this.selectedFlavor) {
      this.cart.currentFlavor = this.selectedFlavor;
    }
    this.closeModal();
  }
}
