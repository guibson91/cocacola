import { CartService } from "../services/cart.service";
import { CommonModule } from "@angular/common";
import { filter } from "rxjs/operators";
import { IonicModule, IonTabs, NavController } from "@ionic/angular";
import { NavigationEnd, Router } from "@angular/router";
import { SharedService } from "../services/shared.service";
import { ChangeDetectorRef, Component, EnvironmentInjector, ViewChild, inject } from "@angular/core";
import { CartContentComponent } from "../components/modals/cart-content/cart-content.component";
import { SystemService } from "../services/system.service";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TabsPage {
  @ViewChild("tabs") tabs: IonTabs;
  selectedTab;
  currentCartToken?: string;

  get hasItems() {
    return this.cart.data && this.cart.data.cartItems && this.cart.data.cartItems.length > 0 && !this.cart.data.isRedeemable;
  }

  public environmentInjector = inject(EnvironmentInjector);
  public cart = inject(CartService);

  constructor(
    public router: Router,
    public ref: ChangeDetectorRef,
    public navCtrl: NavController,
    public shared: SharedService,
    public system: SystemService,
  ) {}

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      let navigationEndEvent = <NavigationEnd>event;
      this.selectedTab = this.getTabFromUrl(navigationEndEvent.urlAfterRedirects);

      if (!this.currentCartToken) {
        this.currentCartToken = this.cart.data.cartToken;
      }

      //Redirecionar pra raiz do carrinho
      if (event.urlAfterRedirects === "/tabs/cart/payment/summary" || event.urlAfterRedirects === "/tabs/cart/payment") {
        if (!this.currentCartToken || this.currentCartToken !== this.cart.data.cartToken) {
          this.currentCartToken = this.cart.data.cartToken;
          if (this.shared.web) {
            this.openCartWeb();
          } else {
            this.navCtrl.navigateBack("tabs/cart");
          }
        }
      }
    });
  }

  async openCartWeb() {
    const modal = await this.system.modalCtrl.create({
      component: CartContentComponent,
      cssClass: "right-web",
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "backdrop") {
        this.system.closeModal$.next();
      }
    });
  }

  getTabFromUrl(url: string): string {
    const urlParts = url.split("/");
    return urlParts[2];
  }
}
