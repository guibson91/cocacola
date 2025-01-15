import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { trigger, state, style, animate, transition, AnimationEvent } from "@angular/animations";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-notification-cart-alive",
  templateUrl: "./notification-cart-alive.component.html",
  styleUrls: ["./notification-cart-alive.component.scss"],
  animations: [
    trigger("fadeOut", [
      state("visible", style({ opacity: 1, height: "*" })),
      state("invisible", style({ opacity: 0, height: "0px", overflow: "hidden" })),
      transition("visible => invisible", animate("500ms ease-out")),
    ]),
  ],
})
export class NotificationCartAliveComponent extends BaseComponent implements OnInit {
  fadeOutState: "visible" | "invisible" = "visible";
  isSectionVisible = true;
  cartIsAlive = false;
  @Output() eventClose = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit() {
    this.cart.updateCart$.subscribe((cart) => {
      if (cart && cart.cartItems && cart.cartItems.length > 0 && !cart.isRedeemable) {
        this.cartIsAlive = true;
      } else {
        this.cartIsAlive = false;
      }
      this.ref.detectChanges();
    });
  }

  closeLastPurchase() {
    this.fadeOutState = "invisible";
    this.eventClose.emit();
  }

  animationDone(event: AnimationEvent): void {
    if (event.toState === "invisible") {
      this.isSectionVisible = false;
    }
  }
}
