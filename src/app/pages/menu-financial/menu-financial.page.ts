import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "src/app/components/components.module";
import { Menu, financialMenu } from "src/app/models/menu";
import { BaseComponent } from "src/app/components/base/base.component";

@Component({
  selector: "app-menu-financial",
  templateUrl: "./menu-financial.page.html",
  styleUrls: ["./menu-financial.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class MenuFinancialPage extends BaseComponent implements OnInit {
  menuItems: Menu[] = financialMenu.filter((m) => {
    if (this.shared.web) {
      return m.id !== "qrcode";
    } else {
      return true;
    }
  });

  constructor() {
    super();
  }

  ngOnInit() {}
}
