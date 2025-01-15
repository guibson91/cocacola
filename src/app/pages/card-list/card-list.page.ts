import { BaseComponent } from "src/app/components/base/base.component";
import { CardCreateComponent } from "src/app/components/modals/card-create/card-create.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Card } from "src/app/models/payment";
import { Menu, financialMenu, menuConfig } from "src/app/models/menu";
import { ParamMap } from "@angular/router";

@Component({
  selector: "app-card-list",
  templateUrl: "./card-list.page.html",
  styleUrls: ["./card-list.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CardListPage extends BaseComponent implements OnInit {
  menuItems: Menu[];

  cards?: Card[];

  type: "financial" | "business";

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loadCards();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const type = paramMap.get("type") as "financial" | "business";

      this.type = type;
      if (this.type === "financial") {
        this.menuItems = financialMenu;
      } else {
        this.menuItems = menuConfig;
      }
    });
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

  async openModal() {
    const modal = await this.system.modalCtrl.create({
      component: CardCreateComponent,
      backdropDismiss: false,
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.role === "success") {
        this.loadCards();
      }
    });
  }

  async askRemoveCard(card: Card) {
    this.system.showAlert(
      "none",
      "Atenção",
      "Você tem certeza que deseja remover esse cartão?",
      "Sim",
      () => {
        this.removeCard(card);
      },
      "Não",
    );
  }

  async removeCard(card: Card) {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.delete("register/cards/" + card.id).subscribe((res) => {
      loading.dismiss();
      if (res.status) {
        this.system.showToast("Cartão removido com sucesso");
        this.loadCards();
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }
}
