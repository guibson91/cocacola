import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, NgZone, ViewChild } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { Customer } from "src/app/models/customer";
import { FormsModule } from "@angular/forms";
import { IonContent, IonicModule } from "@ionic/angular";
import { ProductAttribute } from "src/app/models/product";
import { Banner } from "@app/models/banner";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-orbitta-club",
  templateUrl: "./orbitta-club.page.html",
  styleUrls: ["./orbitta-club.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrbittaClubPage extends BaseComponent {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  benefits? = [
    {
      id: "resgate-produtos-coca-cola",
      labelTop: "Resgate produtos",
      labelBottom: "Coca-Cola",
      image: "assets/images/benefits/coca.svg",
    },
  ];

  loading;
  selectedBrandId;
  categories?: ProductAttribute[] = [];
  customer?: Customer;
  bannerFixed?: Banner;

  showBanners = false;

  constructor(public ngZone: NgZone) {
    super();
    this.changeStatusBar("default");
    this.listenCustomer();
    effect(() => {
      this.ngZone.run(() => {
        this.categories = this.cart.categories();
      });
    });
    effect(() => {
      this.ngZone.run(() => {
        const brands = this.cart.brands();

        if (brands && this.selectedBrandId) {
          const currentBrand: ProductAttribute | undefined = brands?.find((b) => String(b.id) === String(this.selectedBrandId));

          if (currentBrand) {
            this.updateBrand(currentBrand);
          }
        }
      });
    });
    effect(() => {
      const banners = this.cart.bannersPoints()?.filter((b) => {
        if (this.shared.web) {
          return b.flag === "web";
        } else {
          return b.flag === "app";
        }
      });
      console.log("banner points: ", banners);
      this.bannerFixed = banners?.find((b) => b.isFixed);
      console.log("Banner fixed é: ", this.bannerFixed);
    });
  }

  ionViewWillEnter() {
    this.shared.loadCustomer().subscribe(() => {});
    this.showBanners = false;
    this.ref.detectChanges();
    setTimeout(() => {
      this.showBanners = true;
    }, 10);
  }

  handleRefresh(event) {
    combineLatest([this.cart.loadData(), this.shared.getNotifications(), this.shared.loadCustomer()]).subscribe(() => {
      event.target.complete();
    });
  }

  listenCustomer() {
    this.ngZone.run(() => {
      this.shared.customer$.subscribe((customer) => {
        this.customer = customer;
      });
    });
  }

  updateBrand(currentBrand) {
    setTimeout(() => {
      if (this.loading) {
        this.loading.dismiss();
      }
      this.cart.currentBrand = currentBrand;
      this.openPage("tabs/catalog/products?pp=1");
    }, 1000);
  }

  async openBenefit(benefit: any) {
    if (benefit.id === "resgate-produtos-coca-cola") {
      this.system.navCtrl.navigateForward("tabs/pp/orbitta-categories");
    }
  }

  openRules() {
    this.system.navCtrl.navigateForward("tabs/pp/rules");
  }

  openCatalog() {
    this.system.navCtrl.navigateForward("tabs/pp/orbitta-categories");
  }
}
