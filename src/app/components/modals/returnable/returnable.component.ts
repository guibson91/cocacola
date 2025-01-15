import { Component, Input, OnInit } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Product } from "src/app/models/product";

@Component({
  selector: "app-returnable",
  templateUrl: "./returnable.component.html",
  styleUrls: ["./returnable.component.scss"],
})
export class ReturnableComponent extends BaseModalComponent {
  @Input({ required: true }) product: Product;

  constructor() {
    super();
  }

  override ngAfterViewInit(): void {}
}
