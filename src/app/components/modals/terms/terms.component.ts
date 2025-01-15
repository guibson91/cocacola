import { Component, Input, OnInit } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";

@Component({
  selector: "app-terms",
  templateUrl: "./terms.component.html",
  styleUrls: ["./terms.component.scss"],
})
export class TermsComponent extends BaseModalComponent implements OnInit {
  @Input() type: "terms" | "privacy";

  title: string;

  content: string;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.type === "terms") {
      this.title = "Termos de uso";
      this.content = this.shared.htmlTerms;
    } else {
      this.title = "Política de privacidade";
      this.content = this.shared.htmlPrivacy;
    }
  }
}
