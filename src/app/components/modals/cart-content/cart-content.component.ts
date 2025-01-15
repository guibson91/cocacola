import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Cart } from "src/app/models/cart";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { IonContent } from "@ionic/angular";

@Component({
  selector: "app-cart-content",
  templateUrl: "./cart-content.component.html",
  styleUrls: ["./cart-content.component.scss"],
})
export class CartContentComponent extends BaseModalComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  primary = false;
  title: string;

  cartData: Cart;
  subscription;

  isEmpty;

  constructor() {
    super();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goHome() {
    this.openPage("tabs/home");
  }

  ngOnInit() {
    console.log("Primary Modal Cart : ", this.primary);
    this.subscription = this.cart.updateCart$.subscribe((cartData) => {
      this.cartData = cartData;
      if (this.cartData.isEditing) {
        this.title = "Editando pedido";
        if (!this.shared.web) {
          this.primary = true;
        } else {
          this.primary = false;
        }
      } else {
        this.title = "Carrinho";
      }
      if (this.cartData && this.cartData.cartItems && this.cartData.cartItems.length > 0 && !this.cartData.isRedeemable) {
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
      this.ref.detectChanges();
    });
  }

  handleRefresh(event) {
    this.cart.loadData().subscribe(() => {
      event.target.complete();
    });
  }

  ionViewDidEnter(): void {
    this.content.scrollToTop(500);
  }

  next() {
    this.shared.navCtrl.navigateForward("tabs/cart/payment");
    if (this.shared.web) {
      this.closeModal();
    }
  }

  override back() {
    this.shared.navCtrl.navigateBack("tabs/catalog");
  }
}
