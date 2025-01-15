import { BaseComponent } from "src/app/components/base/base.component";
import { ChangeDetectionStrategy, Component, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProductAttribute } from "src/app/models/product";

@Component({
  selector: "app-catalog-categories",
  templateUrl: "./catalog-categories.page.html",
  styleUrls: ["./catalog-categories.page.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CatalogCategoriesPage extends BaseComponent {
  categories?: ProductAttribute[];

  filteredCategories?: ProductAttribute[];
  isPP: boolean = false;

  constructor() {
    super();
    effect(() => {
      this.categories = this.cart.categories();
      this.filteredCategories = this.cart.categories();
      this.ref.detectChanges();
    });
    this.isPP = this.handleIsPP();
  }

  ionViewWillEnter() {
    this.isPP = this.handleIsPP();
  }

  openCategory(category: ProductAttribute) {
    this.cart.currentCategory = category;
    if (this.isPP) {
      this.openPage("tabs/pp/catalog/brands");
    } else {
      this.openPage("tabs/catalog/brands");
    }
  }

  filterList(data: any[]) {
    if (data && data.length > 0) {
      this.filteredCategories = data;
    } else {
      this.filteredCategories = undefined;
    }
  }
}
