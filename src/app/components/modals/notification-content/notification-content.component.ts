import { Component, OnInit } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";

@Component({
  selector: "app-notification-content",
  templateUrl: "./notification-content.component.html",
  styleUrls: ["./notification-content.component.scss"],
})
export class NotificationContentComponent extends BaseModalComponent implements OnInit {
  get notifications() {
    return this.shared.notifications;
  }

  constructor() {
    super();
  }

  ngOnInit() {}
}
