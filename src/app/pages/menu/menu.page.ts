import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Menu, mainMenu } from "src/app/models/menu";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class MenuPage extends BaseComponent {
  menu: Menu[] = mainMenu;
  filteredItems = this.menu;
  shortcuts = this.menu.filter((item) => item.shortcut);
  constructor() {
    super();
    this.changeStatusBar("default");
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
}
