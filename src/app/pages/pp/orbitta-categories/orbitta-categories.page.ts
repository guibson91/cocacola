import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, NgZone, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProductAttribute } from "src/app/models/product";

@Component({
  selector: "app-orbitta-categories",
  templateUrl: "./orbitta-categories.page.html",
  styleUrls: ["./orbitta-categories.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrbittaCategoriesPage extends BaseComponent implements OnInit {
  categories: ProductAttribute[];
  brands: ProductAttribute[];

  selectedBrandId: string;

  loading: HTMLIonLoadingElement;

  isPP;

  constructor(public ngZone: NgZone) {
    super();
    effect(() => {
      this.ngZone.run(() => {
        this.ref.detectChanges();
      });
    });
  }

  selectFilter() {
    if (this.isPP) {
      this.openPage("tabs/pp/catalog/products");
    } else {
      this.openPage("tabs/catalog/products");
    }
  }

  ngOnInit() {
    this.initBrands();
    this.initCategories();
    this.isPP = this.handleIsPP();
  }

  ionViewWillEnter() {
    this.isPP = this.handleIsPP();
  }

  initBrands() {
    this.shared.get<any>(`product?recommended=1&onlyBrands=1`).subscribe((resBrands) => {
      if (resBrands && resBrands.data && resBrands.data.brands && resBrands.data.brands.length > 0) {
        this.brands = resBrands.data.brands.map((brand) => {
          if (brand.images && brand.images[0] && brand.images[0].url) {
            brand.image = brand.images[0].url;
          } else {
            brand.image = "";
          }
          return brand;
        });
      } else {
        this.brands = [];
      }
    });
  }

  initCategories() {
    this.shared.get<any>(`product/category?redeemable=1`).subscribe((resCategories) => {
      if (resCategories && resCategories.data && resCategories.data.items) {
        this.categories = resCategories.data.items.map((cat) => {
          if (cat.images && cat.images[0] && cat.images[0].url) {
            cat.image = cat.images[0].url;
          } else {
            cat.image = "";
          }
          return cat;
        });
      } else {
        this.categories = [];
      }
    });
  }

  seeAll() {
    if (this.isPP) {
      this.openPage("tabs/pp/catalog");
    } else {
      this.openPage("tabs/catalog");
    }
  }

  handleRefresh(event) {
    this.cart.loadData().subscribe(() => {
      event.target.complete();
    });
  }

  // async openBanner(banner: Banner) {
  //   if (banner.type === "pdf" && (banner.link || banner.pdf)) {
  //     this.link.openPDF(banner.link ? banner.link : banner.pdf ? banner.pdf : "");
  //   } else if ((banner.type === "url" || banner.type === "link") && banner.link) {
  //     this.link.openLink(banner.link);
  //   } else if (banner.type === "product" && banner.categoryId && banner.brandId) {
  //     const categories = this.cart.categories();
  //     const currentCategory = categories?.find((c) => String(c.id) === String(banner.categoryId));
  //     if (currentCategory) {
  //       this.selectedBrandId = banner.brandId;
  //       this.loading = await this.system.loadingCtrl.create({});
  //       this.loading.present();
  //       this.cart.currentCategory = currentCategory;
  //       this.ref.detectChanges();
  //     }
  //   }
  // }
}
