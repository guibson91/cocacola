import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class NotificationsPage extends BaseComponent implements OnInit {
  get notifications() {
    return this.shared.notifications;
  }

  constructor() {
    super();
  }

  ngOnInit() {}

  handleRefresh(event) {
    this.shared.getNotifications().subscribe(() => {
      event.target.complete();
    });
  }
}
