import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-float-cart-pp",
  templateUrl: "./float-cart-pp.component.html",
  styleUrls: ["./float-cart-pp.component.scss"],
})
export class FloatCartPpComponent extends BaseComponent implements OnInit {
  showCart = false;
  subscription: Subscription;
  totalItems = 0;
  constructor() {
    super();
  }

  ngOnInit() {
    this.subscription = this.cart.updateCart$.subscribe((cartData) => {
      if (cartData && cartData.cartItems && cartData.cartItems.length > 0 && cartData.isRedeemable) {
        this.showCart = true;
        this.totalItems = cartData.cartItems.length;
      } else {
        this.showCart = false;
        this.totalItems = 0;
      }
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openCartPP() {
    this.openPage("tabs/pp/cart-redeem");
  }
}
