import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-footer-cart",
  templateUrl: "./footer-cart.component.html",
  styleUrls: ["./footer-cart.component.scss"],
})
export class FooterCartComponent extends BaseComponent {
  @Input() labelButton = "Continuar";
  @Input() label = "Subtotal";
  @Input() value;
  @Input() points;
  @Input() disabled: boolean;
  @Output("action") action = new EventEmitter();

  subscription: Subscription;

  constructor() {
    super();
  }

  clickBtn() {
    this.action.emit();
  }
}
