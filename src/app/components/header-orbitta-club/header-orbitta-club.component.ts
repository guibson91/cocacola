import { Component, Input, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { BaseComponent } from "../base/base.component";
import { Customer } from "src/app/models/customer";

@Component({
  selector: "app-header-orbitta-club",
  templateUrl: "./header-orbitta-club.component.html",
  styleUrls: ["./header-orbitta-club.component.scss"],
})
export class HeaderOrbittaClubComponent extends BaseComponent implements OnInit {
  @Input() home = false;
  @Input() title: string = "";
  @Input() subtitle? = "";
  @Input() paddingBottom: string = "0px";
  customer?: Customer;
  user: User;

  constructor() {
    super();
  }

  ngOnInit() {
    this.shared.user$.subscribe((u) => {
      if (u) {
        this.user = u;
        this.ref.detectChanges();
      }
    });
    this.shared.customer$.subscribe((c) => {
      if (c) {
        this.customer = c;
        this.ref.detectChanges();
      }
    });
  }

  //Meus resgates
  openRedemption() {
    this.openPage("tabs/pp/orders");
  }

  //Extrato
  openExtract() {
    this.openPage("tabs/pp/extract");
  }
}
