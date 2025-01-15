import { Component, EventEmitter, NgZone, OnInit, Output } from "@angular/core";
import { trigger, state, style, animate, transition, AnimationEvent } from "@angular/animations";
import { Product } from "src/app/models/product";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-search-products",
  templateUrl: "./search-products.component.html",
  styleUrls: ["./search-products.component.scss"],
  animations: [
    trigger("fadeOut", [
      state("visible", style({ opacity: 1, height: "*" })),
      state("invisible", style({ opacity: 0, height: "0px", overflow: "hidden" })),
      transition("visible => invisible", animate("500ms ease-out")),
    ]),
  ],
})
export class SearchProductsComponent extends BaseComponent implements OnInit {
  filteredProducts: Product[];

  fadeOutState: "visible" | "invisible" = "invisible";

  loading = true;

  q: string;

  isPP: boolean;

  @Output() callback = new EventEmitter<void>();

  constructor(public ngZone: NgZone) {
    super();
  }

  ngOnInit() {
    this.isPP = this.handleIsPP();
  }

  ionViewWillEnter() {
    this.isPP = this.handleIsPP();
  }

  filterList(ev: any) {
    const value = ev.detail.value;
    if (value.length >= 3) {
      this.getProducts(value);
      this.fadeOutState = "visible";
      this.ref.detectChanges();
    } else {
      this.fadeOutState = "invisible";
      this.ref.detectChanges();
    }
  }

  getProducts(q: string) {
    this.q = q;
    this.loading = true;
    this.cart.getProducts("", "", "", q).subscribe((products) => {
      this.loading = false;
      if (products) {
        this.filteredProducts = products;
      } else {
        this.filteredProducts = [];
      }
    });
  }

  async selectFilterdItem(product: Product) {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    if (product.categories) {
      this.cart.currentFlavor = null;
      this.cart.currentCategory = product.categories[0];
      this.cart.currentBrand = product.categories[1];
      this.cart.getProducts(this.cart.currentCategory.id, this.cart.currentBrand.id).subscribe((products) => {
        loading.dismiss();
        this.callback.emit();
        this.ngZone.runOutsideAngular(() => {
          this.cart.products.set(products);
          this.fadeOutState = "invisible";
          this.ref.detectChanges();
        });
      });
    } else {
      console.error("product.categories deveria existir");
    }
  }

  animationDone(event: AnimationEvent): void {
    if (event.toState === "invisible") {
    }
  }
}
