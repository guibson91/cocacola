import { Component, Input, OnInit } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"],
})
export class AlertComponent extends BaseModalComponent implements OnInit {
  @Input({ required: true }) type: "success" | "warn" | "success-coke" | "none" | "default" | "";
  @Input({ required: true }) title;
  @Input({ required: true }) description;
  @Input() mainLabel = "";
  @Input() secondaryLabel = "";
  @Input() mainEvent?: Function;
  @Input() secondaryEvent?: Function;

  image: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    switch (this.type) {
      case "success":
        this.image = "assets/svgs/ok.svg";
        break;
      case "warn":
        this.image = "assets/svgs/notok.svg";
        break;
      case "success-coke":
        this.image = "assets/svgs/coke-happy.svg";
        break;
      case "none":
        this.image = "";
        break;
      case "":
        this.image = "";
        break;
      default:
        this.image = "";
        break;
    }
  }
}
