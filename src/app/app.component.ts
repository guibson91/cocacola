import { CommonModule } from "@angular/common";
import { Component, EnvironmentInjector, inject } from "@angular/core";
import { ComponentsModule } from "./components/components.module";
import { IonicModule, isPlatform } from "@ionic/angular";
import { LoadingService } from "./services/loading.service";
import { Router } from "@angular/router";
import { SharedService } from "./services/shared.service";
import { SystemService } from "./services/system.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ComponentsModule],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);

  loading;

  constructor(
    public shared: SharedService,
    public router: Router,
    private loadingService: LoadingService,
    public system: SystemService,
  ) {
    this.shared.platform.ready().then(() => {
      this.initLoading();
      this.initBackButton();
      this.verifyiOSContext();
      this.verifyDeviceContext();
      this.initOneSignal();
    });
  }

  async initLoading() {
    const loading = await this.system.loadingCtrl.create({});
    this.loadingService.loading$.subscribe((res) => {
      if (this.shared.web) {
        if (res) {
          loading.present();
        } else {
          loading.dismiss();
        }
      } else {
        this.loading = res;
      }
    });
  }

  verifyiOSContext() {
    if (this.shared.platform.is("capacitor") && this.shared.platform.is("ios")) {
      this.shared.ios = true;
    } else {
      this.shared.ios = false;
    }
  }

  verifyDeviceContext() {
    const breakpoint = 768;
    this.shared.web = window.innerWidth >= breakpoint;
    window.addEventListener("resize", () => {
      this.shared.web = window.innerWidth >= breakpoint;
    });
  }

  initOneSignal() {
    this.shared.storage.get("onesignal").then((res) => {
      if (res) {
        this.shared.oneSignalId = res.oneSignalId;
        this.shared.oneSignalToken = res.oneSignalToken;
      }
      this.shared.initOneSignal();
    });
  }

  initBackButton() {
    this.shared.platform.backButton.subscribeWithPriority(10, async () => {
      const modal = await this.shared.modalController.getTop();
      if (modal) {
        return;
      }
      if (
        this.router.url !== "/tabs/home" &&
        this.router.url !== "/tabs/cart" &&
        this.router.url !== "/tabs/catalog" &&
        this.router.url !== "/tabs/menu" &&
        this.router.url !== "/register" &&
        this.router.url !== "/intro" &&
        this.router.url !== "/login"
      ) {
        this.shared.navCtrl.back();
      }
    });
  }
}
