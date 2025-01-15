import { BaseComponent } from "src/app/components/base/base.component";
import { CartContentComponent } from "src/app/components/modals/cart-content/cart-content.component";
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Product } from "src/app/models/product";
import { SpecialProductBase } from "@app/components/products/special-product-base/special-product-base";
import { Subscription } from "rxjs";

@Component({
  selector: "app-catalog-product-detail",
  templateUrl: "./catalog-product-detail.page.html",
  styleUrls: ["./catalog-product-detail.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CatalogProductDetailPage extends SpecialProductBase implements OnInit, OnDestroy {
  product?: Product;
  currentSubs: Subscription;
  isPP?: boolean;

  subtitle;

  quantity?: number;

  constructor() {
    super();
  }

  ngOnDestroy(): void {
    this.product = undefined;
    if (this.currentSubs) {
      this.currentSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.isPP = this.handleIsPP();
    // this.product = productData as any;
    this.currentSubs = this.cart.currentProduct$.subscribe((product) => {
      this.product = product;
      this.quantity = product && product.quantity > 0 ? product.quantity : undefined;
      this.subtitle = "";
      if (this.product?.categories && this.product.categories[0]) {
        this.subtitle += this.product.categories[0].label;
      }
      if (this.product?.categories && this.product.categories[1]) {
        this.subtitle += " | " + this.product.categories[1].label;
      }

      this.ref.detectChanges();
    });
    if (this.cart.currentProduct) {
      this.product = this.cart.currentProduct;
      this.ref.detectChanges();
    } else {
      this.storage.get("currentProduct").then((res) => {
        if (res) {
          this.cart.currentProduct$.next(res);
        }
      });
    }
    this.loadingService.loadingCart$.subscribe((res) => {
      this.loading = res;
    });
  }

  openCart() {
    if (this.shared.web) {
      this.openCartWeb();
    } else {
      this.openPage("tabs/cart");
    }
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
}
