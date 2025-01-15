import { Component, Input, OnInit } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Invoice } from "src/app/models/bankSlip";

@Component({
  selector: "app-loan-detail",
  templateUrl: "./loan-detail.component.html",
  styleUrls: ["./loan-detail.component.scss"],
})
export class LoanDetailComponent extends BaseModalComponent {
  @Input() invoice: Invoice;

  constructor() {
    super();
  }
}
