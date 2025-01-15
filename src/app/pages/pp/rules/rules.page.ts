import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { BaseComponent } from "src/app/components/base/base.component";
import { ComponentsModule } from "src/app/components/components.module";

@Component({
  selector: "app-rules",
  templateUrl: "./rules.page.html",
  styleUrls: ["./rules.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class RulesPage extends BaseComponent implements OnInit {
  rules;

  constructor() {
    super();
  }

  ngOnInit() {
    this.shared.get("engine/point/regulation").subscribe((res) => {
      if (res && res.data) {
        this.rules = res.data;
      }
    });
  }
}
