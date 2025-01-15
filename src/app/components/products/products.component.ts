import { Component, effect, Input, OnDestroy, OnInit } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { Product, TypeProduct } from "src/app/models/product";
import { Subscription } from "rxjs";
import { SpecialProductBase } from "./special-product-base/special-product-base";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent extends SpecialProductBase implements OnInit, OnDestroy {
  @Input({ required: true }) type: TypeProduct;
  @Input() flat = false;
  @Input() products: Product[];

  @Input() isPP = false;

  subscription: Subscription;

  swiperConfig = {
    slidesPerView: "auto",
    spaceBetween: 30,
    slidesPerGroup: 1,
    loop: false,
    mousewheel: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  constructor(public loadingCtrl: LoadingController) {
    super();
    effect(() => {
      this.updateProductsByType();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.listenCartChanges();
    this.updateProductsByType();
    this.listenLoading();
    // this.isPP = this.handleIsPP();
  }

  listenLoading() {
    this.loadingService.loadingCart$.subscribe((res) => {
      if (!res) {
        if (this.loading) {
          this.loading.dismiss();
        }
      }
    });
  }

  listenCartChanges() {
    this.subscription = this.cart.updateCart$.subscribe(() => {
      if (this.type === "cart") {
        this.products =
          this.cart.data.cartProducts?.filter((p) => {
            // p.is_redeemable = true; only for tests
            if (this.isPP) {
              return p.is_redeemable && p.redeemPoints && p.redeemPoints > 0;
            } else {
              return !p.is_only_redeemable;
            }
          }) ?? [];
        this.ref.detectChanges();
      } else {
        this.cart.getProducts();
      }
    });
  }

  updateProductsByType() {
    if (this.type === "products") {
      this.products =
        this.cart.products()?.filter((p) => {
          // p.is_redeemable = true; only for tests
          if (this.isPP) {
            return p.is_redeemable && p.redeemPoints && p.redeemPoints > 0;
          } else {
            return !p.is_only_redeemable;
          }
        }) ?? [];
    } else if (this.type === "recommended" && !this.isPP) {
      this.products = this.cart.recommendedProducts() ?? [];
    } else if (this.type === "recommended" && this.isPP) {
      this.products = this.cart.recommendedPointsProducts() ?? [];
    } else if (this.type === "cart") {
      this.products =
        this.cart.data.cartProducts?.filter((p) => {
          // p.is_redeemable = true; only for tests
          if (this.isPP) {
            return p.is_redeemable && p.redeemPoints && p.redeemPoints > 0;
          } else {
            return !p.is_only_redeemable;
          }
        }) ?? [];
    }
    this.ref.detectChanges();
  }

  removeItem(ev) {
    if (ev && ev.product) {
      const product: Product = ev.product;
      this.system.showAlert(
        "none",
        "Atenção",
        `Tem certeza que deseja remover <b>${product.label}</b> do carrinho?`,
        "Sim",
        async () => {
          this.loading = await this.loadingCtrl.create({});
          this.loading.present();
          this.cart.removeItem(product);
        },
        "Não",
        () => {},
      );
    }
  }
}
