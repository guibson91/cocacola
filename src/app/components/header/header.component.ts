import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NavController } from "@ionic/angular";
import { SharedService } from "src/app/services/shared.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Input({ required: true }) title: string = "";
  @Input() subtitle: string;
  @Input() showBack = true;
  @Input() primary = false;
  @Output() back = new EventEmitter();

  constructor(
    public navCtrl: NavController,
    public shared: SharedService,
  ) {}

  goBack() {
    if (this.back && this.back.observers && this.back.observers.length > 0) {
      this.back.emit();
    } else {
      this.navCtrl.back();
    }
  }
}
