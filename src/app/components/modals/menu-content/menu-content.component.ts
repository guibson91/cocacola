import { Component } from "@angular/core";
import { Menu, mainMenu } from "src/app/models/menu";
import { BaseModalComponent } from "../base-modal/base-modal.component";

@Component({
  selector: "app-menu-content",
  templateUrl: "./menu-content.component.html",
  styleUrls: ["./menu-content.component.scss"],
})
export class MenuContentComponent extends BaseModalComponent {
  menu: Menu[] = [...mainMenu];
  filteredItems = this.menu;
  shortcuts = this.menu.filter((item) => item.shortcut);
  constructor() {
    super();
  }

  filterList(data: any[]) {
    if (data && data.length > 0) {
      this.filteredItems = data;
      this.ref.detectChanges();
    } else {
      this.filteredItems = [];
      this.ref.detectChanges();
    }
  }

  itemWasClicked() {
    if (this.shared.web) {
      this.closeModal();
    }
  }
}
