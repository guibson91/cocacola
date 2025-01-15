import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, effect } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProductAttribute } from "src/app/models/product";

interface BrandGroup {
  group: string;
  brands: ProductAttribute[];
}

@Component({
  selector: "app-catalog-brands",
  templateUrl: "./catalog-brands.page.html",
  styleUrls: ["./catalog-brands.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CatalogBrandsPage extends BaseComponent {
  brands?: ProductAttribute[];
  filteredBrands?: ProductAttribute[];
  brandsWithLetters: BrandGroup[] = [];
  isPP: boolean = false;

  fullBrands?: ProductAttribute[];

  get currentCategory() {
    return this.cart.currentCategory;
  }

  constructor() {
    super();
    this.initCurrentCategory();
    effect(() => {
      this.fullBrands = this.cart.brands();
      this.brands = this.fullBrands;
      this.filteredBrands = this.brands;
      this.brandsWithLetters = this.getBrandsWithLetters();
    });
    this.isPP = this.handleIsPP();
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe((params) => {
      const showAll = params.showAll === "1" || params.showAll === "true" ? true : false;

      if (this.isPP && showAll) {
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
          this.filteredBrands = this.brands;
          this.brandsWithLetters = this.getBrandsWithLetters();
          this.ref.detectChanges();
        });
      } else {
        this.brands = this.fullBrands;
        this.filteredBrands = this.brands;
        this.brandsWithLetters = this.getBrandsWithLetters();
      }
    });
  }

  initCurrentCategory() {
    if (!this.cart.currentCategory) {
      this.storage.get("currentCategory").then((res) => {
        if (res) {
          this.cart.currentCategory = res;
        }
      });
    }
  }

  getBrandsWithLetters() {
    let brands: ProductAttribute[] | undefined = this.filteredBrands;
    let brandsWithLetters: BrandGroup[] = [];
    if (brands && brands.length > 0) {
      let letters = brands.map((b) => {
        let firstChar = b.label[0]?.toUpperCase() || "0-9";
        return /^[A-Z]$/.test(firstChar) ? firstChar : "0-9";
      });
      letters = letters.filter((v, i, a) => a.indexOf(v) === i);
      letters.sort();

      // Move "0-9" to the beginning of the array if it exists
      if (letters.includes("0-9")) {
        letters = ["0-9"].concat(letters.filter((l) => l !== "0-9"));
      }

      letters.forEach((letter) => {
        let brandsByLetter = (brands || []).filter((b) => {
          let firstChar = b.label[0]?.toUpperCase() || "0-9";
          return /^[A-Z]$/.test(firstChar) ? firstChar === letter : letter === "0-9";
        });
        brandsWithLetters.push({ group: letter, brands: brandsByLetter });
      });
    }
    return brandsWithLetters;
  }

  filterList(data: any[]) {
    if (data && data.length > 0) {
      this.filteredBrands = data;
      this.brandsWithLetters = this.getBrandsWithLetters();
    } else {
      this.filteredBrands = undefined;
      this.brandsWithLetters = [];
    }
  }

  openProducts(brand: ProductAttribute) {
    this.cart.currentBrand = brand;
    if (this.isPP) {
      this.openPage("tabs/pp/catalog/products");
    } else {
      this.openPage("tabs/catalog/products");
    }
  }
}
