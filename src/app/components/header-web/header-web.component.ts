import { BaseComponent } from "../base/base.component";
import { CartContentComponent } from "../modals/cart-content/cart-content.component";
import { Component, Input, OnInit } from "@angular/core";
import { MenuContentComponent } from "../modals/menu-content/menu-content.component";
import { NotificationContentComponent } from "../modals/notification-content/notification-content.component";
import { User } from "src/app/models/user";
import { Customer } from "src/app/models/customer";
import { EnvironmentType } from "@app/models/env";
import { environment } from "@env/environment";

@Component({
  selector: "app-header-web",
  templateUrl: "./header-web.component.html",
  styleUrls: ["./header-web.component.scss"],
})
export class HeaderWebComponent extends BaseComponent implements OnInit {
  @Input() title;
  @Input() showCart = true;
  @Input() isHome = false;
  @Input() showClubOrbitta = false;
  @Input() isPP = false;
  user: User;
  environment: EnvironmentType;
  customer: Customer;

  get hasItems() {
    return this.cart.data && this.cart.data.cartItems && this.cart.data.cartItems.length > 0 && !this.cart.data.isRedeemable;
  }

  get hasNotifications() {
    return this.shared.notifications && this.shared.notifications.length > 0;
  }

  constructor() {
    super();
    this.environment = environment;
  }

  ngOnInit() {
    this.shared.user$.subscribe((user) => {
      if (user) {
        this.shared.user = user;
      }
    });
    this.shared.customer$.subscribe((customer) => {
      if (customer) {
        this.customer = customer;
      }
    });
  }

  openExtract() {
    this.router.navigate(["tabs/pp/extract"]);
  }

  openRedemption() {
    this.system.navCtrl.navigateForward("tabs/pp/orders");
  }

  openOrbittaClub() {
    this.router.navigate(["tabs/pp"]);
  }

  goHome() {
    this.openPage("tabs/home");
  }

  async openNotifications() {
    const modal = await this.system.modalCtrl.create({
      component: NotificationContentComponent,
      cssClass: "right-web",
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "backdrop") {
        this.system.closeModal$.next();
      }
    });
  }

  async openCartWeb() {
    const modal = await this.system.modalCtrl.create({
      component: CartContentComponent,
      cssClass: "right-web",
      componentProps: {},
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "backdrop") {
        this.system.closeModal$.next();
      }
    });
  }

  async openMenu() {
    const modal = await this.system.modalCtrl.create({
      component: MenuContentComponent,
      cssClass: "left-web",
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "backdrop") {
        this.system.closeModal$.next();
      }
    });
  }
}
