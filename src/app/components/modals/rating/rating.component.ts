import { Component, Input } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { FormControl, FormGroup } from "@angular/forms";
import { Order } from "src/app/models/order";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.scss"],
})
export class RatingComponent extends BaseModalComponent {
  maxCharacterLimitDescription = 300;
  remainingCharacters = this.maxCharacterLimitDescription;
  countCharacters = 0;

  form = new FormGroup({
    description: new FormControl(""),
  });

  rating = 0;

  @Input() order: Order;

  constructor() {
    super();
  }

  async rate() {
    if (this.rating >= 1) {
      const loading = await this.system.loadingCtrl.create({
        message: "Enviando avaliação",
      });
      loading.present();
      this.shared
        .post("checkout/order-nps/" + this.order.order, {
          rating: this.rating,
          description: this.form.value.description ? this.form.value.description : "",
        })
        .subscribe((res) => {
          loading.dismiss();
          if (res && res.status) {
            this.system.showToast("Avaliação enviada com sucesso", 1500);
            this.closeModal("success");
          } else {
            this.system.showErrorAlert(res);
          }
        });
    } else {
      this.system.showErrorAlert(new Error("Você deve escolher uma nota de avaliação"));
    }
  }

  changeRating(event) {
    this.rating = event;
  }

  changeDescription() {
    this.calcRemainingCharactersDescription();
  }

  calcRemainingCharactersDescription() {
    if (!this.form || !this.form.value.description) {
      this.remainingCharacters = this.maxCharacterLimitDescription;
      this.countCharacters = 0;
    } else {
      this.remainingCharacters = this.maxCharacterLimitDescription - this.form.value.description.length;
      this.countCharacters = this.form.value.description.length;
    }
    this.ref.detectChanges();
  }
}
