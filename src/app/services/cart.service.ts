import { Cart, CartItem, Checkout, SummaryItem } from "../models/cart";
import { combineLatest, map, mergeMap, Observable, of, ReplaySubject, Subject, tap } from "rxjs";
import { Injectable, signal } from "@angular/core";
import { LoadingService } from "./loading.service";
import { Platform } from "@ionic/angular";
import { Product, ProductAttribute, ScalablePrice } from "../models/product";
import { ProductResponse } from "../models/response";
import { Router } from "@angular/router";
import { SharedService } from "./shared.service";
import { Storage } from "@ionic/storage";
import { SystemService } from "./system.service";
import { Banner } from "../models/banner";

@Injectable({
  providedIn: "root",
})
export class CartService {
  categories = signal<ProductAttribute[] | undefined>([]);
  flavors = signal<ProductAttribute[] | undefined>([]);
  brands = signal<ProductAttribute[] | undefined>([]);
  recommendedProducts = signal<Product[] | undefined>([]);
  recommendedPointsProducts = signal<Product[] | undefined>([]);
  products = signal<Product[] | undefined>([]);
  banners = signal<Banner[] | undefined>([]);
  bannersPoints = signal<Banner[] | undefined>([]);

  private _currentCategory: ProductAttribute;
  private _currentBrand: ProductAttribute;
  private _currentFlavor: ProductAttribute | null;

  private _data: Cart = {};

  currentProduct$ = new ReplaySubject<Product | undefined>(1);
  currentProduct?: Product;
  cartItemsMap: Map<string, CartItem> = new Map();

  updateCart$ = new ReplaySubject<Cart>(1);
  updateOrders$ = new Subject<void>();

  modalIsOppened = false;
  changeProduct$ = new Subject<{ id: string; action: "add" | "update" }>();

  operation: "item" | "payment" | "delivery" = "item";

  optionsGauge?;

  handleCatalog$ = new ReplaySubject<void>(1);

  paymentCondition: string = "";

  intervalCheckEditFinished;

  constructor(
    public storage: Storage,
    public platform: Platform,
    public shared: SharedService,
    public loadingService: LoadingService,
    public system: SystemService,
    public router: Router,
  ) {
    this.currentProduct$.subscribe((current) => {
      if (current) {
        this.currentProduct = current;
        this.storage.set("currentProduct", current);
      }
    });
  }

  loadData(): Observable<(Product[] | ProductAttribute[] | undefined)[]> {
    return combineLatest([
      this.shared.get<ProductResponse<Product[]>>(`product?recommended=1`),
      this.shared.get<ProductResponse<ProductAttribute[]>>(`product/category`),
      this.initCart(),
      this.shared.get<{ banners: Banner[] }>("register/banners"),
      this.shared.get<{ banners: Banner[] }>("register/banners?is_redeem=1"),
      this.shared.get<any>("nps-customer-gauge"),
    ]).pipe(
      map(([resProducts, resCategories, _, resBanners, resBannersPoints, resGauge]) => {
        if (
          resProducts.maintenanceParcial ||
          resProducts.maintenanceTotal ||
          resCategories.maintenanceParcial ||
          resCategories.maintenanceTotal ||
          resBanners.maintenanceParcial ||
          resBanners.maintenanceTotal ||
          resGauge.maintenanceParcial ||
          resGauge.maintenanceTotal
        ) {
          this.router.navigateByUrl("/maintenance");
          throw new Error("maintenance");
        }

        if (resGauge && resGauge.data && resGauge.data.surveyId) {
          const options: any = resGauge.data;
          options.surveyId = options.surveyId ? (options.surveyId as string).toLowerCase() : "";
          if (options && options.params && !options.params["Email"]) {
            options.params.Email = this.shared.user?.responsible?.email ? this.shared.user?.responsible?.email : "";
          }
          this.optionsGauge = options;
        } else {
          this.optionsGauge = null;
        }

        if (resBanners && resBanners.data && resBanners.data.banners) {
          const type = this.shared.web ? "web" : "app";
          this.banners.set(resBanners.data.banners.filter((banner) => banner.flag === type));
        } else {
          this.banners.set([]);
        }

        if (resBannersPoints && resBannersPoints.data && resBannersPoints.data.banners) {
          const type = this.shared.web ? "web" : "app";
          this.bannersPoints.set(resBannersPoints.data.banners.filter((banner) => banner.flag === type));
        } else {
          this.bannersPoints.set([]);
        }

        if (resProducts && resProducts.data && resProducts.data.items) {
          const prods = this.getProductsWithCartPaymentDescription(this.productsDTO(resProducts.data.items));
          this.recommendedProducts.set(prods.filter((p) => !p.is_only_redeemable));
          this.recommendedPointsProducts.set(prods.filter((p) => p.is_redeemable && p.redeemPoints && p.redeemPoints > 0));
        } else {
          this.recommendedProducts.set([]);
          this.recommendedPointsProducts.set([]);
        }
        let localCategories;
        if (resCategories && resCategories.data && resCategories.data.items) {
          localCategories = resCategories.data.items.map((cat) => {
            if (cat.images && cat.images[0] && cat.images[0].url) {
              cat.image = cat.images[0].url;
            } else {
              cat.image = "";
            }
            return cat;
          });
        } else {
          localCategories = [];
        }
        this.categories.set(localCategories);
        if (resCategories.httpStatus === 401 || resProducts.httpStatus === 401) {
          this.system.showErrorAlert(new Error("Autenticação inválida. Por favor, realize login novamente. Code: INVALID_AUTH_NO_PRODUCTS"));
          this.shared.logout("INVALID_AUTH_NO_PRODUCTS").subscribe();
        }
        if (resCategories.httpStatus !== 200 && resCategories.httpStatus !== 401) {
          this.system.showErrorAlert(resCategories);
        }
        return [this.recommendedProducts(), this.categories()];
      }),
    );
  }

  initIntervalCheckEditFinished() {
    if (this.data.editableUntil && this.data.isEditing) {
      clearInterval(this.intervalCheckEditFinished);
      this.intervalCheckEditFinished = setInterval(() => {
        const finishedDate = this.data.editableUntil ? new Date(this.data.editableUntil) : null;
        const now = new Date();
        if (finishedDate && finishedDate < now) {
          clearInterval(this.intervalCheckEditFinished);
          this.system.showAlert("warn", "Tempo de edição expirado", "O tempo para edição do pedido expirou. Por favor, refaça o pedido.", "Voltar", () => {
            this.router.navigateByUrl("tabs/orders");
          });
        }
      }, 60000); //Check de 1min em 1min
    }
  }

  public initCart() {
    return this.shared
      .get<Cart>(`checkout/carts`)
      .pipe(
        mergeMap((res) => {
          if (res.status) {
            return of(res);
          } else {
            return this.shared.post<Cart>(`checkout/carts`, {});
          }
        }),
      )
      .pipe(
        tap((res) => {
          if (res && res.data) {
            this.data = res.data;
            if (this.data.isEditing && this.data.editableUntil) {
              this.initIntervalCheckEditFinished();
            }
            this.updateAllPaymentDescription();
          }
        }),
      );
  }

  public clearCart() {
    return this.shared.delete<Cart>(`checkout/carts`);
  }

  get data() {
    return this._data;
  }

  set data(data: Cart) {
    this.cartItemsMap.clear();
    (data.cartItems || []).forEach((item) => this.cartItemsMap.set(item.product.code, item));
    if (data.cartItems && data.cartItems.length > 0) {
      data.cartProducts = this.itemsToProducts(data.cartItems);
    } else {
      data.cartProducts = [];
    }
    if (data.isEditing && data.editableUntil) {
      this.initIntervalCheckEditFinished();
    }
    this._data = data;
    this.updateCart$.next(this._data);
    if (this.operation !== "delivery") {
      this.updateAllProducts();
    }
  }

  get currentCategory(): ProductAttribute {
    return this._currentCategory;
  }

  set currentCategory(category: ProductAttribute) {
    this._currentCategory = category;
    this.storage.set("currentCategory", category);
    this.brands.set(undefined);
    this.getBrands(category.id).subscribe((brands: ProductAttribute[]) => {
      brands = brands.map((brand) => {
        if (brand.images && brand.images[0] && brand.images[0].url) {
          brand.image = brand.images[0].url;
        } else {
          brand.image = "";
        }
        return brand;
      });
      this.brands.set(brands);
    });
  }

  get currentBrand(): ProductAttribute {
    return this._currentBrand;
  }

  set currentBrand(brand: ProductAttribute) {
    this._currentBrand = brand;
    this.storage.set("currentBrand", brand);
    this.products.set(undefined);
    const categoryId = this.currentCategory ? this.currentCategory.id : "";

    const brandId = this.currentBrand ? this.currentBrand.id : "";

    this.getProducts(String(categoryId), String(brandId)).subscribe((products: Product[]) => {
      this.products.set(this.getProductsWithCartPaymentDescription(products));
    });
    this.flavors.set(undefined);
    this.getFlavors(this.currentCategory.id, this.currentBrand.id).subscribe((flavors) => {
      this.flavors.set(flavors);
    });
  }

  get currentFlavor(): ProductAttribute | null {
    return this._currentFlavor;
  }

  set currentFlavor(flavor: ProductAttribute | null) {
    this._currentFlavor = flavor;
    this.products.set(undefined);
    const categoryId = this.currentCategory ? this.currentCategory.id : "";
    const brandId = this.currentBrand ? this.currentBrand.id : "";
    const flavorId = this.currentFlavor ? this.currentFlavor.id : "";
    this.getProducts(categoryId, brandId, flavorId).subscribe((products: Product[]) => {
      this.products.set(products);
    });
  }

  getBrands(categoryId?: string): Observable<ProductAttribute[]> {
    return this.shared.get<ProductResponse<ProductAttribute[]>>(`product/category?ids=${categoryId ? categoryId : ""}`).pipe(
      map((res) => {
        const items = res?.data?.items;
        return items ? items : [];
      }),
    );
  }

  getFlavors(categoryId: string, brandId: string): Observable<ProductAttribute[]> {
    return this.shared.get<ProductResponse<ProductAttribute[]>>(`product/category?ids=${categoryId},${brandId}`).pipe(
      map((res) => {
        const items = res?.data?.items;
        return items ? items : [];
      }),
    );
  }

  getProductsByIds(ids: string[]): Observable<Product[]> {
    const queryParams: string[] = ids;
    const fullEndpoint = `product?ids=${queryParams.join(",")}`;
    return this.shared.get<ProductResponse<Product[]>>(fullEndpoint).pipe(
      map((res) => {
        if (res && res.data && res.data.items) {
          const prods = this.productsDTO(res.data.items);
          return prods;
        } else {
          return [];
        }
      }),
    );
  }

  getProducts(categoryId?: string, brandId?: string, flavorId?, q?: string): Observable<Product[]> {
    const queryParams: string[] = [];

    if (categoryId && !q) {
      queryParams.push(categoryId);
    } else {
      this.currentCategory && !q ? queryParams.push(this.currentCategory.id) : null;
    }
    if (brandId && !q) {
      queryParams.push(brandId);
    } else {
      this.currentBrand && !q ? queryParams.push(this.currentBrand.id) : null;
    }
    if (flavorId && !q) {
      queryParams.push(flavorId);
    }
    if (!q) {
      q = "";
    }

    const size = q ? 5 : "";
    const fullEndpoint = `product?q=${q}&categories=${queryParams.join(",")}&paymentCondition=${this.paymentCondition}&size=${size}`;
    return this.shared.get<ProductResponse<Product[]>>(fullEndpoint).pipe(
      map((res) => {
        if (res && res.data && res.data.items) {
          const prods = this.productsDTO(res.data.items);
          return prods;
        } else {
          return [];
        }
      }),
    );
  }

  private getResetedScalablePrices(product: Product): ScalablePrice[] | undefined {
    if (product && product.scalablePrices) {
      return product.scalablePrices.map((scalable, i) => {
        if (i === 0) {
          return {
            ...scalable,
            active: true,
          };
        } else {
          return {
            ...scalable,
            active: false,
          };
        }
      });
    } else {
      return undefined;
    }
  }

  private updateProduct(product: Product) {
    let scalablePrices = product.scalablePrices;
    const cartItem = this.cartItemsMap.get(product.sku);
    if (cartItem) {
      scalablePrices = cartItem.product.scalablePrices;
      product.scalablePrices = scalablePrices;
      product.quantity = cartItem.quantity ?? 0;
      product.inputQuantity = product.quantity;
    } else {
      product.quantity = 0;
      product.inputQuantity = 0;
      product.scalablePrices = this.getResetedScalablePrices(product);
    }
    const indexPrice = scalablePrices?.findIndex((scalable) => scalable.active);
    if (indexPrice !== undefined && indexPrice >= 0) {
      const current = scalablePrices ? scalablePrices[indexPrice] : null;
      const next = scalablePrices ? scalablePrices[indexPrice + 1] : null;
      if (current) {
        product.currentScalable = current;
      } else {
        product.currentScalable = undefined;
      }
      if (next) {
        product.nextScalable = next;
      } else {
        product.nextScalable = undefined;
      }
    }
    if (product.id === this.currentProduct?.id) {
      this.currentProduct$.next(product);
    }
  }

  private updateProductWithoutCart(product: Product) {
    const indexPrice = product.scalablePrices?.findIndex((scalable) => scalable.active);
    if (indexPrice !== undefined && indexPrice >= 0) {
      const current = product.scalablePrices ? product.scalablePrices[indexPrice] : null;
      const next = product.scalablePrices ? product.scalablePrices[indexPrice + 1] : null;
      if (current) {
        product.currentScalable = current;
      } else {
        product.currentScalable = undefined;
      }
      if (next) {
        product.nextScalable = next;
      } else {
        product.nextScalable = undefined;
      }
    }
  }

  itemsToProducts(items: CartItem[], noCart?: boolean): Product[] {
    const products: Product[] = items.map((item) => {
      const product: Product = {
        ...item.product,
        id: item.product.reference,
        label: item.product.name ? item.product.name : "",
        sku: item.product.code,
        inputQuantity: item.quantity ? item.quantity : 0,
        quantity: item.quantity ? item.quantity : 0,
        promotional: item.promotional ? item.promotional : false,
        rejectionMessage: item.rejectionMessage ? item.rejectionMessage : "",
        redeemPoints: item.product.redeemPoints ? item.product.redeemPoints : 0,
        redeemOriginalPoints: item.product.redeemOriginalPoints ? item.product.redeemOriginalPoints : 0,
        paymentConditionDescription: item.product.paymentConditionDescription ? item.product.paymentConditionDescription : "",
        attributes: {
          scalable: item.product && item.product.scalablePrices && item.product.scalablePrices.length > 1 ? true : false,
          capacityLabel: item.product.capacityLabel,
          weight: item.product.weight ? item.product.weight / 100 : 0,
          quantityPerPackage: item.product.quantityPerPackage,
        },
      };
      return product;
    });
    if (noCart) {
      (products || []).forEach(this.updateProductWithoutCart.bind(this));
    } else {
      (products || []).forEach(this.updateProduct.bind(this));
    }
    return products;
  }

  getSummaryItems(c: Checkout, full?: boolean): SummaryItem[] {
    const summary: SummaryItem[] = [];
    if (c) {
      if (c.delivery) {
        summary.push({
          label: "Tipo de entrega",
          value: c.delivery.label,
        });
      }
      if (c.shipping) {
        summary.push({
          label: "Taxa de entrega",
          price: c.shipping,
        });
      }
      if (c.payment) {
        summary.push({
          label: "Forma de pagamento",
          value: c.payment.paymentMethod === "pix" ? "PIX" : c.payment.paymentMethodDescription,
        });
        summary.push({
          label: "Cond. de pagamento",
          value: c.payment.description,
        });
      }
      if (c.subtotal) {
        summary.push({
          label: "Subtotal",
          price: c.subtotal,
        });
      }
      if (c.remainingBalance) {
        summary.push({
          label: "Saldo disponível",
          price: c.remainingBalance,
        });
      }
      if (c.discount) {
        summary.push({
          label: "Descontos",
          price: c.discount,
        });
      }
      if (full) {
        summary.push({
          label: "Total",
          price: c.amount,
        });
      }
    }
    return summary;
  }

  getSummaryPointsItems(c: Checkout): SummaryItem[] {
    const summary: SummaryItem[] = [];
    if (c) {
      summary.push({
        label: "Subtotal",
        value: c.subtotal_redeem_points ? String(c.subtotal_redeem_points) : "0",
      });
      summary.push({
        label: "Subtotal frete",
        value: c.shipping ? String(c.shipping) : "0",
      });
      summary.push({
        label: "Total",
        value: c.totalRedeemPoints ? String(c.totalRedeemPoints) : "0",
      });
    }
    return summary;
  }

  addItem(product, notNotify?: boolean, isRedeemable?: boolean, forceRedirectCart?: boolean) {
    this.loadingService.loadingCart$.next(true);
    this.shared
      .post<Cart>(`checkout/carts/cart-items/${product.id}`, {
        item: {
          quantity: product.inputQuantity ? Number(product.inputQuantity) : 1,
          isRedeemable: isRedeemable ? true : false,
        },
      })
      .subscribe((res) => {
        this.loadingService.loadingCart$.next(false);
        if (res.status) {
          this.data = res.data;
          if (!notNotify) {
            this.changeProduct$.next({ id: product.id, action: "add" });
          }
          if (forceRedirectCart) {
            this.router.navigateByUrl(isRedeemable ? "tabs/pp/cart-redeem" : "tabs/cart");
          }
        } else {
          this.system.showErrorAlert(new Error(res.message ? res.message : "Erro ao adicionar produto"));
        }
      });
  }

  updateAllPaymentDescription() {
    const currentProducts = this.products();
    const recommendedProducts = this.recommendedProducts();
    const currentProductsUpdated = this.getProductsWithCartPaymentDescription(currentProducts);
    const recommendedProductsUpdated = this.getProductsWithCartPaymentDescription(recommendedProducts);
    this.products.set(currentProductsUpdated);
    this.recommendedProducts.set(recommendedProductsUpdated);
  }

  getProductsWithCartPaymentDescription(products: Product[] = []) {
    if (!products || products.length === 0) {
      return [];
    }
    if (this.data && this.data.cartItems && this.data.cartItems.length > 0) {
      const defaultDescription = this.data.cartItems[0].product.paymentConditionDescription;
      const defaultPaymentCondition = this.data.cartItems[0].product.paymentCondition;
      if (defaultPaymentCondition) {
        this.paymentCondition = defaultPaymentCondition;
        this.getProducts().subscribe(() => {});
      } else {
        this.paymentCondition = "";
      }
      if (!defaultDescription) {
        return products;
      }
      const prods = products.map((p) => {
        p.paymentConditionDescription = defaultDescription;
        return p;
      });
      return prods;
    } else {
      return products;
    }
  }

  updateItem(product, notNotify?: boolean, isRedeemable?: boolean, forceRedirectCart?: boolean) {
    this.loadingService.loadingCart$.next(true);
    this.shared
      .put<Cart>(`checkout/carts/cart-items/${product.id}`, {
        item: {
          quantity: product.inputQuantity ? Number(product.inputQuantity) : 1,
        },
      })
      .subscribe((res) => {
        this.loadingService.loadingCart$.next(false);
        if (res.status) {
          this.data = res.data;
          if (!notNotify) {
            this.changeProduct$.next({ id: product.id, action: "update" });
          }
          if (forceRedirectCart) {
            this.router.navigateByUrl(isRedeemable ? "tabs/pp/cart-redeem" : "tabs/cart");
          }
        } else {
          this.system.showErrorAlert(new Error(res.message ? res.message : "Erro ao atualizar produto"));
        }
      });
  }

  removeItem(product) {
    this.loadingService.loadingCart$.next(true);
    this.shared.delete<Cart>(`checkout/carts/cart-items/${product.id}`, {}).subscribe((res) => {
      this.loadingService.loadingCart$.next(false);
      if (res.status) {
        this.data = res.data;
      } else {
        this.system.showErrorAlert(new Error(res.message ? res.message : "Erro ao remover produto"));
      }
    });
  }

  private productsDTO(products: Product[]): Product[] {
    return products.map((product) => {
      if (!product.attributes) {
        product.attributes = {};
      }
      product.attributes.scalable = product.scalablePrices && product.scalablePrices.length > 1 ? true : false;
      if (!product.image) {
        product.image = product && product.images && product.images?.length > 0 ? product.images[0].url : "";
      }
      this.updateProduct(product);
      return product;
    });
  }

  private updateAllProducts() {
    (this.products() || []).forEach(this.updateProduct.bind(this));
    (this.recommendedProducts() || []).forEach(this.updateProduct.bind(this));
  }
}
