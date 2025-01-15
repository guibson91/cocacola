import { BaseComponent } from "../base/base.component";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd } from "@angular/router";
import { Subscription, filter } from "rxjs";
import { CreditLimit } from "src/app/models/balance";

@Component({
  selector: "app-credit-limit-content",
  templateUrl: "./credit-limit-content.component.html",
  styleUrls: ["./credit-limit-content.component.scss"],
})
export class CreditLimitContentComponent extends BaseComponent implements OnInit, OnDestroy {
  creditLimit: CreditLimit;

  subscription: Subscription;

  constructor() {
    super();
  }

  ngOnInit() {
    this.subscription = this.router.events
      .pipe(
        filter(
          (event) => event instanceof NavigationEnd && (event.urlAfterRedirects.includes("/tabs/menu/credit-limit") || event.urlAfterRedirects.includes("/tabs/menu/financial")),
        ),
      )
      .subscribe(() => {
        this.load();
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async load() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.get<CreditLimit>(`user/credit-limit`).subscribe((res) => {
      loading.dismiss();
      if (res && res.data) {
        const creditLimit = res.data;
        creditLimit.visitDate = new Date(creditLimit.visitDate);
        creditLimit.salesVisitDate = new Date(creditLimit.salesVisitDate);
        creditLimit.salesPlannerVisitDate = new Date(creditLimit.salesPlannerVisitDate);
        this.creditLimit = creditLimit;
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }
}
