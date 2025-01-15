import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "src/app/components/components.module";
import { BaseComponent } from "src/app/components/base/base.component";
import { Menu, menuConfig } from "src/app/models/menu";

@Component({
  selector: "app-menu-alerts",
  templateUrl: "./menu-alerts.page.html",
  styleUrls: ["./menu-alerts.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class MenuAlertsPage extends BaseComponent implements OnInit {
  menuItems: Menu[] = menuConfig;

  alerts = [
    {
      id: "alert",
      label: "Alertas",
      checked: false,
    },
    {
      id: "alert",
      label: "Dívidas",
      checked: false,
    },
    {
      id: "alert",
      label: "Vencimento de Boletos",
      checked: false,
    },
    {
      id: "alert",
      label: "Campanhas",
      checked: false,
    },
    {
      id: "alert",
      label: "Publicidades",
      checked: false,
    },
    {
      id: "alert",
      label: "Clube de Compras",
      checked: false,
    },
    {
      id: "alert",
      label: "Pagamentos",
      checked: false,
    },
    {
      id: "alert",
      label: "Saldo Remanecente",
      checked: false,
    },
    {
      id: "alert",
      label: "Entrega de mercadorias",
      checked: false,
    },
  ];

  constructor() {
    super();
  }

  ngOnInit() {}
}
