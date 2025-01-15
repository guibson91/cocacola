import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { debounceTime, mergeMap, Subject, Subscription } from "rxjs";
import { Product, TypeProduct } from "src/app/models/product";
import { SpecialProductBase } from "../special-product-base/special-product-base";
@Component({
  selector: "app-plus-minus",
  templateUrl: "./plus-minus.component.html",
  styleUrls: ["./plus-minus.component.scss"],
})
export class PlusMinusComponent extends SpecialProductBase implements OnInit, OnDestroy {
  @Input({ required: true }) product: Product;
  @Input({ required: true }) type: TypeProduct;
  @Input() isPP = false;
  private _quantity: string;
  @Input() set quantity(value: any) {
    if (value) {
      // this._quantity = String(value);
      this.product.inputQuantity = Number(value);
      this.handleQuantity();
    } else {
      this._quantity = "0";
    }
  }
  get quantity() {
    return this._quantity;
  }

  private debounceClick$ = new Subject<{ action: "plus" | "minus"; product: any }>();
  private inputChange$ = new Subject<Product>();

  isLoading = false;

  subscriptionLoading: Subscription;
  subscriptionProduct: Subscription;
  subscriptionClicks: Subscription;
  subscriptionInputChange: Subscription;
  subscriptionChangeProduct: Subscription;
  subscriptionUpdateCart: Subscription;

  cartIsRedeemable = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.listenCartChanges();
    this.listenClicks();
    this.listenInputChange();
    this.listenCurrentProduct();
    this.listenSpecialProducts();
    this.listenLoading();
    this.handleCartIsRedeemable();
    this.handleQuantity();
    // this.cart.handleCatalog$.subscribe(() => {
    //   this.handleCartIsRedeemable();
    //   this.handleQuantity();
    // });
  }

  listenCartChanges() {
    this.subscriptionUpdateCart = this.cart.updateCart$.subscribe((cartData) => {
      this.handleCartIsRedeemable();
      this.handleQuantity();
    });
  }

  handleQuantity() {
    //Carrinho sempre fiel ao inputQuantity
    if (this.type === "cart") {
      this._quantity = String(this.product.inputQuantity);
    }
    //Catálogo
    else {
      if (this.isPP && this.cartIsRedeemable) {
        this._quantity = String(this.product.inputQuantity);
      } else if (!this.isPP && !this.cartIsRedeemable) {
        this._quantity = String(this.product.inputQuantity);
      } else {
        this._quantity = "0";
      }
      this.ref.detectChanges();
    }
  }

  handleCartIsRedeemable() {
    if (this.cart.data && this.cart.data.cartItems && this.cart.data.cartItems.length > 0 && this.cart.data.isRedeemable) {
      this.cartIsRedeemable = true;
    } else {
      this.cartIsRedeemable = false;
    }
  }

  listenLoading() {
    if (this.subscriptionLoading) {
      this.subscriptionLoading.unsubscribe();
    }
    this.subscriptionLoading = this.loadingService.loadingCart$.subscribe((res) => {
      this.isLoading = res;
      this.ref.detectChanges();
    });
  }

  listenSpecialProducts() {
    this.subscriptionChangeProduct = this.cart.changeProduct$.subscribe((res) => {
      if (res && res.id === this.product.id && this.type === "products") {
        this.handleSpecialProduct(this.product, res.action);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionLoading) {
      this.subscriptionLoading.unsubscribe();
    }
    if (this.subscriptionProduct) {
      this.subscriptionProduct.unsubscribe();
    }
    if (this.subscriptionClicks) {
      this.subscriptionClicks.unsubscribe();
    }
    if (this.subscriptionInputChange) {
      this.subscriptionInputChange.unsubscribe();
    }
    if (this.subscriptionChangeProduct) {
      this.subscriptionChangeProduct.unsubscribe();
    }
    if (this.subscriptionUpdateCart) {
      this.subscriptionUpdateCart.unsubscribe();
    }
  }

  listenCurrentProduct() {
    this.subscriptionProduct = this.cart.currentProduct$.subscribe((prod) => {
      if (prod && prod.id === this.product.id) {
        this.product = prod;
        this.handleQuantity();
      }
    });
  }

  listenClicks() {
    this.subscriptionClicks = this.debounceClick$.pipe(debounceTime(1000)).subscribe((data) => {
      if (data.action === "plus") {
        this.realPlus(data.product);
      } else if (data.action === "minus") {
        this.realMinus(data.product);
      }
    });
  }

  askExchangeCart() {
    this.system.showAlert(
      "none",
      "Atenção",
      "Você já possui produtos no carrinho do programa de pontos. Deseja alterar para o carrinho convencional?",
      "Sim",
      () => {
        this.loading = true;
        this.cart
          .clearCart()
          .pipe(mergeMap(() => this.cart.loadData()))
          .subscribe((res) => {
            this.loading = false;
            this.cartIsRedeemable = false;
            this.isPP = false;
            this.subscriptionUpdateCart.unsubscribe();
            this.ref.detectChanges();
            this.system.showToast("Carrinho de pontos removido com sucesso");
          });
      },
      "Não",
      () => {},
    );
  }

  listenInputChange() {
    this.subscriptionInputChange = this.inputChange$.pipe(debounceTime(1400)).subscribe((product) => {
      this.changeQuantity(product);
    });
  }

  plus(product) {
    if (this.isLoading) {
      return;
    }
    if (!this.isPP && this.cartIsRedeemable) {
      this.askExchangeCart();
      return;
    }
    product.inputQuantity++;
    this.quantity = product.inputQuantity;
    if (!this.isLoading) {
      this.debounceClick$.next({ action: "plus", product });
    }
  }

  minus(product: Product) {
    if (this.isLoading) {
      return;
    }
    if (product.inputQuantity > 0) {
      if (!this.isPP && this.cartIsRedeemable) {
        this.askExchangeCart();
        return;
      }
      product.inputQuantity--;
      this.quantity = product.inputQuantity;
      this.debounceClick$.next({ action: "minus", product });
    }
  }

  realPlus(product: Product) {
    if (product.quantity === 0) {
      this.cart.addItem(product, undefined, false);
    } else {
      this.cart.updateItem(product);
    }
  }

  realMinus(product) {
    if (product.inputQuantity >= 0) {
      if (product.inputQuantity === 0) {
        this.cart.removeItem(product);
      } else if (product.inputQuantity >= 1) {
        this.cart.updateItem(product);
      }
    }
  }

  handleInputChange(product: Product) {
    // if (this.cartIsRedeemable) {
    //   return;
    // }

    let sanitizedValueStr = this.quantity.replace(/[^0-9]/g, "");

    if (sanitizedValueStr === "") {
      sanitizedValueStr = "0";
    }
    let sanitizedValue = Number(sanitizedValueStr);
    setTimeout(() => {
      this.quantity = sanitizedValueStr;
      product.inputQuantity = sanitizedValue;

      if (sanitizedValue !== product.quantity) {
        this.inputChange$.next(product);
      }
      this.ref.detectChanges();
    }, 10);
  }

  changeQuantity(product: Product) {
    if (this.isLoading) {
      return;
    }
    if (!product.inputQuantity || product.inputQuantity === 0) {
      this.cart.removeItem(product);
    } else {
      if (!product.quantity || product.quantity === 0) {
        this.cart.addItem(product, undefined, false);
      } else {
        this.cart.updateItem(product);
      }
    }
  }

  getFocus() {
    if (this.quantity === "0") {
      setTimeout(() => {
        this.quantity = "";
        this.product.inputQuantity = 0;
      }, 5);
    }
  }
}
