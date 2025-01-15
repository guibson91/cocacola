import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "src/app/components/components.module";
import { Menu, menuConfig } from "src/app/models/menu";
import { BaseComponent } from "src/app/components/base/base.component";
import { User } from "src/app/models/user";
import { currentVersion } from "src/environments/version";

@Component({
  selector: "app-menu-config",
  templateUrl: "./menu-config.page.html",
  styleUrls: ["./menu-config.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class MenuConfigPage extends BaseComponent implements OnInit {
  menuItems: Menu[] = menuConfig;
  user?: User;
  buildTime = currentVersion.buildTime;

  constructor() {
    super();
  }

  ngOnInit() {
    this.shared.user$.subscribe((user) => {
      this.user = user;
      this.ref.detectChanges();
    });
  }

  openRecoveryPassword() {
    this.openPage("recovery-password");
  }

  openChangeResponsible() {
    this.openPage("change-information");
  }
}
