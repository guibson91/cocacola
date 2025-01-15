import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-container-web",
  templateUrl: "./container-web.component.html",
  styleUrls: ["./container-web.component.scss"],
})
export class ContainerWebComponent extends BaseComponent {
  constructor() {
    super();
  }
}
