import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Menu, financialMenu, menuBusiness } from "src/app/models/menu";

@Component({
  selector: "app-container-with-menu",
  templateUrl: "./container-with-menu.component.html",
  styleUrls: ["./container-with-menu.component.scss"],
})
export class ContainerWithMenuComponent extends BaseComponent implements OnInit {
  @Input() menu: Menu[] = menuBusiness;
  @Input() description;
  @Input() primary = false;
  @Input() type: "financial" | "business" = "business";
  @Input() hideMenu = false;

  @Input() paddingTop = "0";

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.type === "financial") {
      this.menu = financialMenu.filter((m) => {
        if (this.shared.web) {
          return m.id !== "qrcode";
        } else {
          return true;
        }
      });
    }
  }
}
