import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../../base/base.component";

@Component({
  selector: "app-header-form",
  templateUrl: "./header-form.component.html",
  styleUrls: ["./header-form.component.scss"],
})
export class HeaderFormComponent extends BaseComponent implements OnInit {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() bigger?: boolean = false;
  @Input() forceWebTitle?: boolean = false;

  constructor() {
    super();
  }

  ngOnInit() {}
}
