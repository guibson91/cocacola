import { Card } from "src/app/models/payment";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { CardCreateComponent } from "../card-create/card-create.component";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-card-select",
  templateUrl: "./card-select.component.html",
  styleUrls: ["./card-select.component.scss"],
})
export class CardSelectComponent extends BaseModalComponent implements OnInit {
  cards?: Card[];

  selectedCard: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loadCards();
  }

  select() {
    this.closeModal("select", { card: this.selectedCard });
  }

  async loadCards() {
    this.cards = undefined;
    this.shared.get<Card[]>("register/cards").subscribe((res) => {
      if (res && res.status) {
        this.cards = res.data;
      } else {
        this.cards = [];
      }
    });
  }

  async openNewCard() {
    const modal = await this.system.modalCtrl.create({
      component: CardCreateComponent,
      backdropDismiss: false,
      componentProps: {
        remainBlur: true,
      },
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "success") {
        this.loadCards();
      }
    });
  }
}
