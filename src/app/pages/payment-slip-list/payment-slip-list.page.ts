import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "src/app/components/components.module";
import { BaseComponent } from "src/app/components/base/base.component";

@Component({
  selector: "app-payment-slip-list",
  templateUrl: "./payment-slip-list.page.html",
  styleUrls: ["./payment-slip-list.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class PaymentSlipListPage extends BaseComponent {
  constructor() {
    super();
  }
}
