import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { BaseComponent } from "src/app/components/base/base.component";
import { LoadingService } from "src/app/services/loading.service";

@Component({
  selector: "app-blocked-outdated",
  templateUrl: "./blocked-outdated.page.html",
  styleUrls: ["./blocked-outdated.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class BlockedOutdatedPage extends BaseComponent implements OnInit {
  @Input({ required: true }) type: "success" | "warn" | "success-coke" | "none" | "default" | "" = "warn";

  image: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    switch (this.type) {
      case "success":
        this.image = "assets/svgs/ok.svg";
        break;
      case "warn":
        this.image = "assets/svgs/notok.svg";
        break;
      case "success-coke":
        this.image = "assets/svgs/coke-happy.svg";
        break;
      case "none":
        this.image = "";
        break;
      case "":
        this.image = "";
        break;
      default:
        this.image = "";
        break;
    }
  }

  verify() {
    this.loadingService.loading$.next(true);
    this.openPage("tabs/home");
  }
}
