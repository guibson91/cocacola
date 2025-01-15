import { Component, Input, OnInit } from "@angular/core";
import { trigger, state, style, animate, transition, AnimationEvent } from "@angular/animations";
import { BaseComponent } from "../base/base.component";
import { CartContentComponent } from "../modals/cart-content/cart-content.component";

@Component({
  selector: "app-rebuy",
  templateUrl: "./rebuy.component.html",
  styleUrls: ["./rebuy.component.scss"],
  animations: [
    trigger("fadeOut", [
      state("visible", style({ opacity: 1, height: "*" })),
      state("invisible", style({ opacity: 0, height: "0px", overflow: "hidden" })),
      transition("visible => invisible", animate("500ms ease-out")),
    ]),
  ],
})
export class RebuyComponent extends BaseComponent implements OnInit {
  fadeOutState: "visible" | "invisible" = "visible";
  isSectionVisible: boolean = true;
  @Input() origem?: string;

  constructor() {
    super();
  }

  ngOnInit() {}

  closeLastPurchase() {
    this.fadeOutState = "invisible";
  }

  animationDone(event: AnimationEvent): void {
    if (event.toState === "invisible") {
      this.isSectionVisible = false;
    }
  }

  async addLastPurchaseProducts() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.post("checkout/remake-order", {}).subscribe((res) => {
      loading.dismiss();
      if (res && res.status && res.data) {
        this.cart.data = res.data;
        this.closeLastPurchase();
        if (this.shared.web) {
          this.openCartWeb();
        } else {
          this.openPage("tabs/cart");
        }
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }

  async openCartWeb() {
    const modal = await this.system.modalCtrl.create({
      component: CartContentComponent,
      cssClass: "right-web",
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "backdrop") {
        this.system.closeModal$.next();
      }
    });
  }
}
