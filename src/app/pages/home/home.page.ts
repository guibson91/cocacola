import { AfterContentInit, Component, CUSTOM_ELEMENTS_SCHEMA, effect, NgZone, OnInit, Renderer2, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/components/base/base.component";
import { combineLatest, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "src/app/components/components.module";
import { Debt } from "src/app/models/debt";
import { FormsModule } from "@angular/forms";
import { GetnetService } from "src/app/services/getnet.service";
import { IonContent, IonicModule } from "@ionic/angular";
import { ProductAttribute } from "src/app/models/product";
import { TermsComponent } from "src/app/components/modals/terms/terms.component";

declare var CG: any;
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage extends BaseComponent implements OnInit, AfterContentInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  debtData;

  categories?: ProductAttribute[] = [];

  selectedBrandId: string;

  loading: HTMLIonLoadingElement;

  constructor(
    public getnet: GetnetService,
    private renderer: Renderer2,
    public ngZone: NgZone,
  ) {
    super();
    this.changeStatusBar("default");
    effect(() => {
      this.ngZone.run(() => {
        this.categories = this.cart.categories();
        this.ref.detectChanges();
      });
    });
    effect(() => {
      this.ngZone.run(() => {
        const brands = this.cart.brands();
        if (brands && this.selectedBrandId) {
          const currentBrand: ProductAttribute | undefined = brands?.find((b) => String(b.id) === String(this.selectedBrandId));
          if (currentBrand) {
            this.updateBrand(currentBrand);
          }
        }
      });
    });
  }

  updateBrand(currentBrand) {
    setTimeout(() => {
      if (this.loading) {
        this.loading.dismiss();
      }
      this.cart.currentBrand = currentBrand;
      this.openPage("tabs/catalog/products");
    }, 1000);
  }

  ionViewDidEnter(): void {
    this.content.scrollToTop(500);
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.initCustomerGauge();
    }, 2000);
  }

  ngOnInit(): void {
    this.addFingerprintScript();
    this.getUserDebts().subscribe();
  }

  addFingerprintScript() {
    if (!this.shared.user || !this.shared.user.getnet_org_id) {
      console.error("Usuário não possui getnet_org_id");
      return;
    }
    if (!this.getnet.sessionId) {
      console.error("Não foi possível encontrar sessionId! Vamos gerar imediatamente");
      try {
        this.getnet.generateSessionId(this.shared.user);
        setTimeout(() => {
          this.addFingerprintScript();
        }, 1000);
      } catch (err) {
        console.error("Error ao gerar sessionId: ", err);
      }
      return;
    }
    const script = this.renderer.createElement("script");
    script.type = "text/javascript";
    script.src = `https://h.online-metrix.net/fp/tags.js?org_id=${this.shared.user.getnet_org_id}&session_id=${this.getnet.sessionId}`;
    this.renderer.appendChild(document.head, script);
  }

  getUserDebts() {
    return this.shared.get<{ debts: Debt[]; totalDebts: number }>("debt").pipe(
      tap((res) => {
        this.debtData = res.data;
        this.ref.detectChanges();
      }),
    );
  }

  openDebts() {
    this.openPage("tabs/menu/payment-debts");
  }

  test() {
    this.shared.accessToken = "";
    this.storage.set("accessToken", "");
    // this.shared.refreshToken = "";
    // const url =
    //   "https://www.googleapis.com/androidpublisher/v3/applications/br.com.mobiup.sorocabarefrescos/reviews?access_token=688662940834-ed7gtifdp8vmqtqhc4ah0cngpbt13k4c.apps.googleusercontent.com";

    // fetch(url)
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok " + response.statusText);
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //
    //   })
    //   .catch((error) => {
    //     console.error("There has been a problem with your fetch operation:", error);
    //   });
  }

  async openTermsPrivacy(type: "terms" | "privacy") {
    const modal = await this.system.modalCtrl.create({
      component: TermsComponent,
      backdropDismiss: false,
      cssClass: "terms",
      componentProps: {
        type,
      },
    });
    modal.present();
  }

  openBusiness() {
    this.openPage("tabs/menu/business");
  }

  handleRefresh(event) {
    combineLatest([this.cart.loadData(), this.shared.getNotifications(), this.getUserDebts()]).subscribe(() => {
      this.initCustomerGauge();
      event.target.complete();
    });
  }

  initCustomerGauge() {
    if (this.cart.optionsGauge) {
      const options = {
        ...this.cart.optionsGauge,
        params: {
          Email: this.cart.optionsGauge.params.email,
          Telefone: this.cart.optionsGauge.params.phone,
          Zona: this.cart.optionsGauge.params.zone,
          "Tipo de pesquisa": this.cart.optionsGauge.params.typeSurvey,
          "Número do cliente - Nome do Negócio": this.cart.optionsGauge.params.businessName,
        },
      };
      CG.init(options);
    }
  }
}
