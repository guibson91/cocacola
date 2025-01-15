import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, effect } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Banner } from "src/app/models/banner";
import Swiper from "swiper";
import { map, switchMap } from "rxjs";
import { ProductAttribute } from "@app/models/product";

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.scss"],
})
export class BannerComponent extends BaseComponent implements OnInit {
  banners?: Banner[];
  @Input() isPP: boolean = false;
  @Input() simpleBanner?: Banner;

  @ViewChild("swiper") swiperRef: ElementRef;
  swiper?: Swiper;

  //Padrão web
  slidesPerView = 6;

  selectedBrandId: string;

  loading: HTMLIonLoadingElement;

  orbittaBanners?: Banner[];
  pointBanners?: Banner[];

  constructor() {
    super();
    effect(() => {
      this.orbittaBanners = this.cart.banners();
      this.pointBanners = this.cart.bannersPoints()?.filter((b) => !b.isFixed);
    });
  }

  ngOnInit() {
    if (this.simpleBanner) {
      this.banners = [this.simpleBanner];
    } else if (this.isPP) {
      this.banners = this.pointBanners;
    } else {
      this.banners = this.orbittaBanners;
    }
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 450) {
      this.slidesPerView = 1;
    } else if (screenWidth < 700) {
      this.slidesPerView = 2;
    } else if (screenWidth < 950) {
      this.slidesPerView = 3;
    } else if (screenWidth < 1200) {
      this.slidesPerView = 4;
    } else if (screenWidth < 1500) {
      this.slidesPerView = 5;
    } else if (screenWidth < 1800) {
      this.slidesPerView = 6;
    } else {
      this.slidesPerView = 7;
    }
  }

  ngOnDestroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  }

  swiperReady() {
    setTimeout(() => {
      const el = this.swiperRef?.nativeElement;
      if (el && el.swiper) {
        setTimeout(() => {
          this.swiper = el.swiper;
          this.ref.detectChanges();
          this.onSwiperInteraction();
        }, 100);
      }
    }, 100);
  }

  onSwiperInteraction() {
    if (this.swiper && this.swiper.autoplay) {
      this.swiper.autoplay.start();
      setTimeout(() => {
        this.swiper?.autoplay.start();
      }, 100);
    }
  }

  slideNext() {
    if (this.swiper) {
      this.swiper.slideNext(200);
    }
  }

  slidePrev() {
    if (this.swiper) {
      this.swiper.slidePrev(200);
    }
  }

  async openBanner(banner: Banner) {
    if (banner.type === "pdf" && (banner.link || banner.pdf)) {
      this.link.openPDF(banner.link ? banner.link : banner.pdf ? banner.pdf : "");
    } else if ((banner.type === "url" || banner.type === "link") && banner.link) {
      this.link.openLink(banner.link);
    } else if (banner.type === "product" && banner.categoryId && banner.brandId) {
      const categories = this.cart.categories();
      const currentCategory = categories?.find((c) => String(c.id) === String(banner.categoryId));

      if (currentCategory) {
        this.selectedBrandId = banner.brandId;
        this.loading = await this.system.loadingCtrl.create({});
        this.loading.present();
        this.cart.currentCategory = currentCategory;
        this.cart
          .getBrands(currentCategory.id)
          .pipe(
            map((brands: ProductAttribute[]) => {
              const currentBrand = brands.find((b) => Number(b.id) === Number(banner.brandId));

              if (currentBrand) {
                this.cart.currentBrand = currentBrand;
                return true;
              } else {
                throw new Error(`Marca ${banner.brandId} não encontrada`);
              }
            }),
          )
          .subscribe({
            next: () => {
              this.loading.dismiss();
              if (banner.is_redeem) {
                this.openPage("tabs/pp/catalog/products");
              } else {
                this.openPage("tabs/catalog/products");
              }
            },
            error: (err) => {
              console.error("Error: ", err);
              this.loading.dismiss();
              this.system.showErrorAlert(err);
            },
          });
      } else {
        console.error("Category not found");
        this.loading.dismiss();
      }
    }
  }

  updateSwipers() {
    if (this.swiper) {
      this.swiper.update();
    }
  }
}
