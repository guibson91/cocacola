import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base/base.component";

@Component({
  selector: "app-contact-box",
  templateUrl: "./contact-box.component.html",
  styleUrls: ["./contact-box.component.scss"],
})
export class ContactBoxComponent extends BaseComponent {
  constructor() {
    super();
  }
}
