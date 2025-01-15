import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "src/app/components/components.module";
import { BaseComponent } from "src/app/components/base/base.component";
import { LendAsset } from "src/app/models/lendAssets";

@Component({
  selector: "app-loaned-asset",
  templateUrl: "./loaned-asset.page.html",
  styleUrls: ["./loaned-asset.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class LoanedAssetPage extends BaseComponent implements OnInit {
  loanedAssets?: LendAsset[];

  filteredLoanedAssets?: LendAsset[];

  constructor() {
    super();
  }

  ngOnInit() {
    this.getLoanAssets();
  }

  private async getLoanAssets() {
    // const loading = await this.system.loadingCtrl.create({});
    // loading.present();
    this.shared.get<LendAsset[]>("user/lend-assets").subscribe((res) => {
      // loading.dismiss();

      if (res.status && res.data) {
        this.loanedAssets = res.data;
        this.filteredLoanedAssets = this.loanedAssets;
      } else {
        this.loanedAssets = [];
        this.filteredLoanedAssets = [];
      }
    });
  }

  filterList(data: any[]) {
    if (data && data.length > 0) {
      this.filteredLoanedAssets = data;
    } else {
      this.filteredLoanedAssets = undefined;
    }
  }
}
