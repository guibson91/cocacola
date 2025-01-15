import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { ProductAttribute } from "src/app/models/product";

@Component({
  selector: "app-category-item",
  templateUrl: "./category-item.component.html",
  styleUrls: ["./category-item.component.scss"],
})
export class CategoryItemComponent extends BaseComponent implements OnInit {
  @Input({ required: true }) category: ProductAttribute;
  @Output() selectProductAttr = new EventEmitter<ProductAttribute>();

  isPP: boolean;

  constructor() {
    super();
  }

  ionViewWillEnter() {
    this.isPP = this.handleIsPP();
  }

  ngOnInit() {
    this.isPP = this.handleIsPP();
  }

  openCategory(category: ProductAttribute) {
    this.selectProductAttr.emit(category);
    //
    // this.cart.currentCategory = category;
    // this.ref.detectChanges();
    // if (this.isPP) {
    //   this.openPage("tabs/pp/catalog/products");
    // } else {
    //   this.openPage("tabs/catalog/brands");
    // }
  }
}
