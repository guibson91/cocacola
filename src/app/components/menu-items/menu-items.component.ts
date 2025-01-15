import { Component, Input, OnInit } from "@angular/core";
import { Menu } from "src/app/models/menu";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-menu-items",
  templateUrl: "./menu-items.component.html",
  styleUrls: ["./menu-items.component.scss"],
})
export class MenuItemsComponent extends BaseComponent implements OnInit {
  @Input() showBusiness = true;
  @Input() primary = false;
  @Input({ required: true }) items: Menu[];
  @Input() type?: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.type === "financial") {
      this.primary = false;
    } else {
      this.primary = true;
    }

    if (!this.showBusiness) {
      this.items = this.items.filter((el) => (el as Menu).id !== "my-business");
    }
  }
}
