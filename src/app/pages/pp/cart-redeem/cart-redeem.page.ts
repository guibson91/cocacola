import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, FormsModule, Validators } from "@angular/forms";
import { IonicModule, LoadingController } from "@ionic/angular";
import { ComponentsModule } from "@app/components/components.module";
import { BaseComponent } from "@app/components/base/base.component";
import { Product } from "@app/models/product";
import { Cart } from "@app/models/cart";
import { Delivery } from "@app/models/delivery";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cart-redeem",
  templateUrl: "./cart-redeem.page.html",
  styleUrls: ["./cart-redeem.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CartRedeemPage extends BaseComponent implements OnInit {
  selectedDeliveryHash?: string;
  cartData: Cart;
  loadingDeliveries: boolean = false;
  form: FormGroup = new FormGroup({
    cpf: new FormControl("", [Validators.required, Validators.minLength(11)]),
    name: new FormControl("", [Validators.required]),
  });

  subscription: Subscription;

  isEmpty: boolean = true;

  currentDelivery?: Delivery;

  loading: HTMLIonLoadingElement;

  subtitle: string = "Nenhum item adicionado";

  constructor(public loadingCtrl: LoadingController) {
    super();
  }

  ngOnInit() {
    this.subscription = this.cart.updateCart$.subscribe((cartData) => {
      this.cartData = cartData;

      this.currentDelivery = this.cart.data.deliveries?.find((d) => d.active);
      if (this.currentDelivery) {
        this.selectedDeliveryHash = this.currentDelivery.hash;
      }
      if (this.cartData && this.cartData.cartItems && this.cartData.cartItems.length > 0 && this.cartData.isRedeemable) {
        this.subtitle = `${this.cartData.cartItems.length} itens adicionados`;
        this.isEmpty = false;
      } else {
        this.subtitle = "Nenhum item adicionado";

        this.isEmpty = true;
      }
      this.ref.detectChanges();
    });
    this.loadingService.loadingCart$.subscribe(async (res) => {
      if (!res) {
        if (this.loading) {
          this.loading.dismiss();
        }
        if (!this.cartData.cartItems || this.cartData.cartItems.length == 0) {
          this.isEmpty = true;
          this.ref.detectChanges();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleRefresh(event) {
    this.cart.loadData().subscribe(() => {
      event.target.complete();
    });
  }

  handleInputChange() {}

  continue() {
    if (!this.cart.data || !this.cart.data.totalRedeemPoints) {
      this.system.showAlert("none", "Atenção", "Você precisa adicionar produtos ao carrinho para continuar.", "Ok", () => {});
      return;
    }
    if (!this.cart.data.minimumPoints) {
      this.cart.data.minimumPoints = 0;
    }
    if (this.cart.data && this.cart.data.totalRedeemPoints && this.cart.data.totalRedeemPoints < this.cart.data.minimumPoints) {
      this.system.showAlert("none", "Atenção", `Você precisa de no mínimo ${this.cart.data.minimumPoints} pontos para resgatar produtos.`, "Ok", () => {});
      return;
    }
    this.openPage("tabs/pp/cart-redeem/summary");
  }

  removeItem(product) {
    if (product) {
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

  goHomePP() {
    this.openPage("tabs/pp");
  }

  changeDelivery(delivery: Delivery) {
    if (delivery.hash === this.selectedDeliveryHash) {
      return;
    } else {
      this.selectedDeliveryHash = delivery.hash;
      this.ref.detectChanges();
      this.loadingDeliveries = true;
      this.shared.put<Cart>("checkout/carts/delivery", { hash: delivery.hash }).subscribe((res) => {
        this.loadingDeliveries = false;
        if (res.status) {
          this.cart.data = res.data;
          this.currentDelivery = this.cart.data.deliveries?.find((d) => d.active);
        } else {
          this.system.showErrorAlert(res);
        }
      });
    }
  }
}
