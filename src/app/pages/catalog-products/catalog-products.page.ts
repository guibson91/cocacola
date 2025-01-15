import { Banner } from "@app/models/banner";
import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, effect, OnDestroy, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FilterProductsComponent } from "src/app/components/modals/filter-products/filter-products.component";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Product, ProductAttribute } from "src/app/models/product";

@Component({
  selector: "app-catalog-products",
  templateUrl: "./catalog-products.page.html",
  styleUrls: ["./catalog-products.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CatalogProductsPage extends BaseComponent implements OnDestroy {
  products?: Product[];

  brands?: ProductAttribute[];

  cartIsAlive = true;

  flavors;

  isPP: boolean = false;

  banners?: Banner[];

  constructor() {
    super();
    this.initCurrentCategoryAndBrand();
    this.isPP = this.handleIsPP();
    effect(() => {
      const cartProducts = this.cart.products();

      if (cartProducts) {
        this.products = cartProducts.filter((p) => {
          // p.is_redeemable = true; only for tests
          if (this.isPP) {
            return p.is_redeemable && p.redeemPoints && p.redeemPoints > 0;
          } else {
            return !p.is_only_redeemable;
          }
        });
      }
    });
    effect(() => {
      const brands = this.cart.brands();
      if (brands) {
        this.brands = brands.filter((b) => b && this.cart.currentBrand && b.id !== this.cart.currentBrand.id);
      } else {
        this.brands = [];
      }
    });
    effect(() => {
      this.flavors = this.cart.flavors();
      this.ref.detectChanges();
    });
  }

  ionViewWillEnter() {
    this.isPP = this.handleIsPP();
    this.cart.handleCatalog$.next();
  }

  async initCurrentCategoryAndBrand() {
    if (!this.cart.currentCategory || !this.cart.currentBrand) {
      this.storage.get("currentCategory").then((resCategory) => {
        if (resCategory) {
          this.cart.currentCategory = resCategory;
          this.storage.get("currentBrand").then((resBrand) => {
            if (resBrand) {
              this.cart.currentBrand = resBrand;
            }
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.reset();
  }

  reset() {
    this.products = undefined;
    this.brands = undefined;
    this.flavors = undefined;
    this.cart.currentFlavor = null;
    this.ref.detectChanges();
  }

  async openFilter() {
    const modal = await this.shared.modalController.create({
      component: FilterProductsComponent,
      backdropDismiss: false,
    });
    modal.present();
  }

  selectBrand(brand: ProductAttribute) {
    setTimeout(() => {
      this.cart.currentBrand = brand;
      const allBrands = this.cart.brands();
      if (allBrands) {
        this.brands = allBrands.filter((b) => b && brand && b.id !== brand.id);
        this.ref.detectChanges();
      } else {
        this.brands = [];
      }
    }, 100);
  }

  closeCartAlive() {
    setTimeout(() => {
      this.cartIsAlive = false;
    }, 500);
  }
}
