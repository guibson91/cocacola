import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-content-orbitta-club",
  templateUrl: "./content-orbitta-club.component.html",
  styleUrls: ["./content-orbitta-club.component.scss"],
})
export class ContentOrbittaClubComponent extends BaseComponent implements OnInit {
  @Input() contentOrbitta = true;
  @Input() margin = false;
  @Input() marginTop = "0";
  constructor() {
    super();
  }

  ngOnInit() {}
}
