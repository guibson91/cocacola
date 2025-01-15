import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {
    this.changeStatusBar("primary");
  }
}
