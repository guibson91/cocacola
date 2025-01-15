import { BaseComponent } from "src/app/components/base/base.component";
import { Cart } from "src/app/models/cart";
import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonContent, IonicModule } from "@ionic/angular";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CartPage extends BaseComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  cartData: Cart;
  subscription;

  isEmpty;

  constructor() {
    super();
    this.changeStatusBar("default");
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
    this.subscription = this.cart.updateCart$.subscribe((cartData) => {
      this.cartData = cartData;
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
  }

  override back() {
    this.shared.navCtrl.navigateBack("tabs/catalog");
  }
}
