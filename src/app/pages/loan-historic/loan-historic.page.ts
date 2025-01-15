import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "src/app/components/components.module";
import { BaseComponent } from "src/app/components/base/base.component";

@Component({
  selector: "app-loan-historic",
  templateUrl: "./loan-historic.page.html",
  styleUrls: ["./loan-historic.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class LoanHistoricPage extends BaseComponent {
  constructor() {
    super();
  }
}
