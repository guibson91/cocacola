import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { CreditLimit } from "src/app/models/balance";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: "app-credit-limit",
  templateUrl: "./credit-limit.page.html",
  styleUrls: ["./credit-limit.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class CreditLimitPage extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
