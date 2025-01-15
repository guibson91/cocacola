import { addIcons } from "ionicons";
import { checkmarkOutline } from "ionicons/icons";
import { Component, Input, OnInit } from "@angular/core";
import { Product } from "src/app/models/product";
import { SpecialProductBase } from "../products/special-product-base/special-product-base";
import { Subscription } from "rxjs";

@Component({
  selector: "app-suggested-product",
  templateUrl: "./suggested-product.component.html",
  styleUrls: ["./suggested-product.component.scss"],
})
export class SuggestedProductComponent extends SpecialProductBase implements OnInit {
  @Input() product: Product;
  @Input() isPP = false;
  subscription: Subscription;
  isLoading = false;
  cartIsRedeemable = false;
  constructor() {
    super();
  }

  ngOnInit() {
    addIcons({ checkmarkOutline });
    // this.isPP = this.handleIsPP();
    this.loadingService.loadingCart$.subscribe((res) => {
      this.isLoading = res;
      this.ref.detectChanges();
    });
    this.subscription = this.cart.updateCart$.subscribe((cartData) => {
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
  }
}
