import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { Product } from "src/app/models/product";
import { ReturnableComponent } from "../../modals/returnable/returnable.component";
import { ScalableComponent } from "../../modals/scalable/scalable.component";
import { TypeProduct } from "../../../models/product";
import { LoadingService } from "@app/services/loading.service";

@Component({
  selector: "app-base",
  template: "",
  styles: [],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SpecialProductBase extends BaseComponent {
  loading;

  @Output() remove = new EventEmitter();

  constructor() {
    super();
  }

  async openReturnableModal(product: Product) {
    if (this.cart.modalIsOppened) {
      return;
    }
    this.cart.modalIsOppened = true;
    const modal = await this.system.modalCtrl.create({
      component: ReturnableComponent,
      backdropDismiss: false,
      componentProps: {
        product,
      },
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      this.cart.modalIsOppened = false;
      if (res.role === "confirm") {
        this.openProductDetailPage();
      }
    });
  }

  async openScalableModal() {
    if (this.cart.modalIsOppened) {
      return;
    }
    this.cart.modalIsOppened = true;
    const modal = await this.system.modalCtrl.create({
      component: ScalableComponent,
      backdropDismiss: false,
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      this.cart.modalIsOppened = false;
      if (res.role === "confirm") {
        this.openProductDetailPage();
      }
    });
  }

  addProductPP(product: Product, forceRedirectCart?: boolean, quantity?: number) {
    //Existe carrinho
    if (this.cart.data && this.cart.data.cartItems && this.cart.data.cartItems.length > 0 && !this.cart.data.isRedeemable) {
      this.system.showAlert(
        "none",
        "Atenção",
        "Você já possui produtos no carrinho. Deseja alterar para o carrinho do programa de pontos?",
        "Sim",
        () => {
          this.loadingService.loadingCart$.next(true);
          product.inputQuantity = quantity as any;
          this.cart.addItem(product, undefined, true, forceRedirectCart);
        },
        "Não",
        () => {},
      );
    } else {
      this.loadingService.loadingCart$.next(true);

      if (product.quantity >= 1) {
        product.inputQuantity = quantity as any;
        this.cart.updateItem(product, undefined, true, forceRedirectCart);
      } else {
        product.inputQuantity = quantity as any;
        this.cart.addItem(product, undefined, true, forceRedirectCart);
      }
    }
  }

  private openProductDetailPage(isPP?: boolean) {
    if (isPP) {
      this.system.navCtrl.navigateForward("tabs/pp/catalog/products/details");
    } else {
      this.system.navCtrl.navigateForward("tabs/catalog/products/details");
    }
  }

  openProductDetails(product: Product, type: TypeProduct, isPP?: boolean) {
    if (type === "cart" || type === "summary" || (type === "recommended" && !isPP)) {
      return;
    }
    this.cart.currentProduct$.next(product);
    if (isPP) {
      this.openProductDetailPage(true);
    } else if (product.attributes?.scalable && !this.shared.web) {
      this.openScalableModal();
    } else if (product.attributes?.returnable && !this.shared.web) {
      this.openReturnableModal(product);
    } else {
      this.openProductDetailPage();
    }
  }

  handleSpecialProduct(product: Product, type: "add" | "update" | "remove") {
    if (this.router.url !== "/tabs/catalog/products") {
      return false;
    } else if (product.attributes?.scalable && type === "add") {
      this.openScalableModal();
      this.cart.currentProduct$.next(product);
      return true;
    } else if (product.attributes?.returnable && type === "add") {
      this.openReturnableModal(product);
      this.cart.currentProduct$.next(product);
      return true;
    } else {
      return false;
    }
  }

  removeProduct(product: Product) {
    this.remove.emit({ product });
  }

  // removeItem(product: Product) {
  //   this.system.showAlert('none', 'Atenção', `Tem certeza que deseja remover <b>${product.label}</b> do carrinho?`, 'Sim', async () => {
  //     this.loading = await this.system.loadingCtrl.create({});
  //     this.loading.present();
  //     this.cart.removeItem(product);
  //   }, 'Não', () => {
  //
  //   });
  // }
}
