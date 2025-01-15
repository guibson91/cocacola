import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { ProductAttribute } from "src/app/models/product";
import { BaseComponent } from "../base/base.component";
import Swiper from "swiper";

@Component({
  selector: "app-categories-slide",
  templateUrl: "./categories-slide.component.html",
  styleUrls: ["./categories-slide.component.scss"],
})
export class CategoriesSlideComponent extends BaseComponent implements OnInit {
  @ViewChild("swiper2") swiperRef2: ElementRef;
  swiper2: Swiper;

  @Input({ required: true }) categories: ProductAttribute[];
  @Input() title: string = "Produtos";
  @Input() isBrand = false;
  isPP = false;

  slidesPerView = 6;

  constructor() {
    super();
  }

  ngOnInit() {
    this.isPP = this.handleIsPP();
  }

  ionViewWillEnter() {
    this.isPP = this.handleIsPP();
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.initSwipers();
    }, 100);
  }

  ngOnDestroy() {
    if (this.swiper2) {
      this.swiper2.destroy(true, true);
    }
  }

  seeAll() {
    //Abrir lista de categorias
    if (!this.isBrand) {
      if (this.isPP) {
        this.openPage("tabs/pp/catalog");
      } else {
        this.openPage("tabs/catalog");
      }
    }
    //Abrir lista de marcas
    else {
      if (this.isPP) {
        this.openPage("tabs/pp/catalog/brands?showAll=1");
      } else {
        this.openPage("tabs/catalog/brands?showAll=1");
      }
    }
  }

  openProductAttribute(productAttribute: ProductAttribute) {
    if (this.isBrand) {
      this.openProducts(productAttribute);
    } else {
      this.openCategory(productAttribute);
    }
  }

  openProducts(brand: ProductAttribute) {
    const categories = this.cart.categories();
    const currentCategory = categories?.find((c) => String(c.id) === String(brand.categoryId));
    if (currentCategory) {
      this.cart.currentCategory = currentCategory;
      this.cart.currentBrand = brand;
      this.ref.detectChanges();
      this.updateSwipers();
    }
    if (this.isPP) {
      this.openPage("tabs/pp/catalog/products");
    } else {
      this.openPage("tabs/catalog/products");
    }
  }

  openCategory(category: ProductAttribute) {
    this.cart.currentCategory = category;
    if (this.isPP) {
      this.openPage("tabs/pp/catalog/brands");
    } else {
      this.openPage("tabs/catalog/brands");
    }
  }

  swiperReady2() {
    setTimeout(() => {
      const el = this.swiperRef2?.nativeElement;
      if (el && el.swiper) {
        setTimeout(() => {
          this.swiper2 = el.swiper;
        }, 100);
      }
    }, 100);
  }

  initSwipers() {
    this.swiperReady2();
  }

  updateSwipers() {
    if (this.swiper2) {
      this.swiper2.update();
    }
  }
}
