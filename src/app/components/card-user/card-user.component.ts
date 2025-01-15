import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { User } from "src/app/models/user";
import { Subscription } from "rxjs";
import { Customer } from "@app/models/customer";

@Component({
  selector: "app-card-user",
  templateUrl: "./card-user.component.html",
  styleUrls: ["./card-user.component.scss"],
})
export class CardUserComponent extends BaseComponent implements OnInit {
  @Input() hideCart = false;
  @Input() points = false;
  user?: User;
  customer?: Customer;
  showCart;

  subscription: Subscription;

  get notifications() {
    return this.shared.notifications;
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.shared.user$.subscribe((user) => {
      this.user = user;
    });
    this.shared.customer$.subscribe((c) => {
      if (c) {
        this.customer = c;
        this.ref.detectChanges();
      } else {
        this.customer = undefined;
        this.ref.detectChanges();
      }
    });
    if (!this.hideCart) {
      this.subscription = this.cart.updateCart$.subscribe((cartData) => {
        if (cartData && cartData.cartItems && cartData.cartItems.length > 0 && cartData.isRedeemable) {
          this.showCart = true;
        } else {
          this.showCart = false;
        }
        this.ref.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openNotifications() {
    this.openPage("notifications");
  }

  openConfig() {
    this.openPage("tabs/menu/config");
  }

  openCartPP() {
    this.openPage("tabs/pp/cart-redeem");
  }
}
