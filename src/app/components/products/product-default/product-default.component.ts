import { addIcons } from "ionicons";
import { checkmarkOutline } from "ionicons/icons";
import { Component, Input, OnInit } from "@angular/core";
import { Product, TypeProduct } from "src/app/models/product";
import { SpecialProductBase } from "../special-product-base/special-product-base";
import { Subscription } from "rxjs";
@Component({
  selector: "app-product-default",
  templateUrl: "./product-default.component.html",
  styleUrls: ["./product-default.component.scss"],
})
export class ProductDefaultComponent extends SpecialProductBase implements OnInit {
  @Input() product!: Product;
  @Input() type: TypeProduct = "summary";
  @Input() isPP;
  @Input() flat = false;

  isLoading = false;

  subscription: Subscription;
  subscriptionCart: Subscription;
  cartIsRedeemable = false;

  constructor() {
    super();
  }

  ngOnInit() {
    addIcons({ checkmarkOutline });
    this.subscription = this.loadingService.loadingCart$.subscribe((res) => {
      this.isLoading = res;
      this.ref.detectChanges();
    });
    this.subscriptionCart = this.cart.updateCart$.subscribe((cartData) => {
      if (cartData && cartData.cartItems && cartData.cartItems.length > 0 && cartData.isRedeemable) {
        this.cartIsRedeemable = true;
      } else {
        this.cartIsRedeemable = false;
      }
      this.ref.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionCart) {
      this.subscriptionCart.unsubscribe();
    }
  }
}
