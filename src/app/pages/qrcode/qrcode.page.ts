import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-qrcode",
  templateUrl: "./qrcode.page.html",
  styleUrls: ["./qrcode.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class QrcodePage extends BaseComponent implements OnInit, OnDestroy {
  isSupported;

  mockup = "0069024676;01-209468;00001;00101-20946820221011120517;11/10/2022;X-X006-C;X;327,48;0,00;0,00;";

  subscriptionBackButton: Subscription;

  constructor() {
    super();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy() {
    document.querySelector("body")?.classList.remove("qrcode-active");
    if (this.subscriptionBackButton) {
      this.subscriptionBackButton.unsubscribe();
    }
  }

  ngOnInit() {
    this.initBackButton();
    this.init();
  }

  initBackButton() {
    this.subscriptionBackButton = this.shared.platform.backButton.subscribeWithPriority(100, async () => {
      this.back();
    });
  }

  async init() {
    //@test
    // this.handleResult(this.mockup);
    // return;

    const resSupported = await BarcodeScanner.isSupported();

    if (resSupported.supported) {
      this.startScan();
    } else {
      this.system.showAlert("none", "Atenção", "Seu dispositivo não fornece suporte para leitura de QRCode.", "Entendi", () => {
        this.back();
      });
    }
  }

  async startScan() {
    document.querySelector("body")?.classList.add("barcode-scanner-active");
    await BarcodeScanner.addListener("barcodeScanned", async (result) => {
      this.handleResult(result.barcode.rawValue);
    });
    if (this.shared.platform.is("android")) {
      const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (available) {
        await BarcodeScanner.startScan();
      } else {
        await BarcodeScanner.installGoogleBarcodeScannerModule();
        await BarcodeScanner.startScan();
      }
    } else {
      await BarcodeScanner.startScan();
    }
  }

  override back() {
    this.stopScan();
    this.destroy();
    this.system.navCtrl.back();
  }

  async stopScan() {
    document.querySelector("body")?.classList.remove("barcode-scanner-active");
    await BarcodeScanner.removeAllListeners();
    await BarcodeScanner.stopScan();
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();

    return camera === "granted" || camera === "limited";
  }

  async handleResult(text) {
    this.stopScan();
    let clientId = text.split(";")[0];
    if (!this.shared.user || clientId != this.shared.user.clientId) {
      this.system.showAlert("none", "Atenção", "Usuário logado não é o mesmo o que foi gerado o QR Code", "Entendi", () => {
        this.back();
      });
      return;
    }
    console.log("text size: ", text.split(";").length);
    //Success
    if (text && text.split(";") && text.split(";").length >= 10) {
      this.openPage([
        "sfcoke-payment",
        {
          qrcode: text,
        },
      ]);
    }
    //Bad formatted
    else {
      this.system.showAlert("none", "Atenção", "QR Code lido é inválido", "Entendi", () => {
        this.back();
      });
    }
  }
}
