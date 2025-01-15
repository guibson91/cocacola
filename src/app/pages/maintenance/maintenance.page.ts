import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { IonicModule } from "@ionic/angular";
import { Subject, Subscription, filter, fromEvent, takeUntil } from "rxjs";
import { LoadingService } from "src/app/services/loading.service";
import { Event, NavigationEnd, NavigationStart } from "@angular/router";

@Component({
  selector: "app-maintenance",
  templateUrl: "./maintenance.page.html",
  styleUrls: ["./maintenance.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ComponentsModule],
})
export class MaintenancePage extends BaseComponent implements OnInit, OnDestroy {
  subscriptionBackButton: Subscription;
  subscriptionLoading: Subscription;

  private unsubscriber: Subject<void> = new Subject<void>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.blockMobileBackButton();
    this.blockBrowserBackButton();
    this.handleBrowserBackButton();
  }

  ngOnDestroy(): void {
    if (this.subscriptionBackButton) {
      this.subscriptionBackButton.unsubscribe();
    }
    if (this.subscriptionLoading) {
      this.subscriptionLoading.unsubscribe();
    }
    if (this.subscriptionBackButton) {
      this.subscriptionBackButton.unsubscribe();
    }
  }

  handleBrowserBackButton() {
    history.pushState(null, "");
    fromEvent(window, "popstate")
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((_) => {
        history.pushState(null, "");
        this.back();
      });
  }

  blockBrowserBackButton() {
    this.subscriptionBackButton = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (event.url === "/maintenance") {
          this.location.replaceState("/maintenance");
        }
      }
    });
  }

  blockMobileBackButton() {
    this.subscriptionBackButton = this.shared.platform.backButton.subscribeWithPriority(100, async () => {});
  }

  async retry() {
    this.unsubscriber = new Subject<void>();
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.get<any>("product/category").subscribe((res) => {
      loading.dismiss();
      if (!res.maintenanceParcial && !res.maintenanceTotal) {
        if (this.shared.user) {
          this.router.navigateByUrl("/tabs/home");
          this.loadingService.loading$.next(true);
        } else {
          this.router.navigateByUrl("/login");
        }
      }
    });
  }
}
