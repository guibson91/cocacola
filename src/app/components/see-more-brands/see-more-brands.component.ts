import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductAttribute } from "src/app/models/product";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-see-more-brands",
  templateUrl: "./see-more-brands.component.html",
  styleUrls: ["./see-more-brands.component.scss"],
})
export class SeeMoreBrandsComponent extends BaseComponent implements OnInit {
  @Input() brands?: ProductAttribute[];
  @Output() selectBrand = new EventEmitter<ProductAttribute>();

  constructor() {
    super();
  }

  ngOnInit() {}

  chooseBrand(brand: ProductAttribute) {
    this.selectBrand.emit(brand);
  }
}
