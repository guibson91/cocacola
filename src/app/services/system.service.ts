import { AlertComponent } from "../components/modals/alert/alert.component";
import { Injectable } from "@angular/core";
import { AlertController, LoadingController, ModalController, NavController, PopoverController, ToastController } from "@ionic/angular";
import { SharedService } from "./shared.service";
import { LinkService } from "./link.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SystemService {
  //efeito blur para modais
  blur = false;

  closeModal$ = new Subject<void>();

  enablePP = true;
  enableCheckOrder = true;
  enableEditOrder = true;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public shared: SharedService,
    public link: LinkService,
  ) {}

  public async showToast(message: string, duration?: number) {
    const toast = await this.toastCtrl.create({
      message,
      duration: duration ?? 3000,
    });
    await toast.present();
  }

  /**
   * 'none' title color warn | 'default' title color dark
   */
  async showAlert(
    typeImage: "success" | "warn" | "success-coke" | "default" | "none",
    title: string,
    description: string,
    mainLabel?: string | null,
    mainEvent?: Function | null,
    secondaryLabel?: string | null,
    secondaryEvent?: Function | null,
    hideHelpButton?: boolean,
    showClose?: boolean,
  ) {
    const modal = await this.modalCtrl.create({
      component: AlertComponent,
      backdropDismiss: false,
      cssClass: typeImage,
      componentProps: {
        type: typeImage,
        title: title,
        description: description,
        mainLabel: mainLabel ?? null,
        secondaryLabel: typeImage === "none" && !secondaryLabel && !hideHelpButton ? "Preciso de ajuda" : secondaryLabel ?? null,
        showClose: showClose,
        mainEvent,
        secondaryEvent,
      },
    });
    modal.present();
    modal.onDidDismiss().then(({ role }) => {
      //Condição para exibir o "Preciso de ajuda" default
      if (typeImage === "none" && !secondaryLabel && role === "secondary") {
        this.openSupport();
      }
    });
  }

  async openSupport() {
    const loading = await this.loadingCtrl.create({});
    loading.present();
    this.shared.get<{ location: string }>("support/zendesk").subscribe((res) => {
      loading.dismiss();
      if (res.data?.location) {
        this.link.openLink(res.data.location);
      } else {
        this.showErrorAlert(res, "Atenção", true);
      }
    });
  }

  public async showErrorAlert(response?: any, title?: string, hideHelpButton?) {
    console.error("Ocorreu um erro: ", response);

    let msg = "Ocorreu uma falha de comunicação! Tente novamente mais tarde.";
    const alertTitle = title ?? "Atenção";

    if (response?.message) {
      msg = response.message;
    } else if (response?.error_description) {
      msg = response.error_description;
    } else if (response?.error_message) {
      msg = response.error_message;
    } else if (response?.data?.error_description) {
      msg = response.data.error_description;
    } else if (response?.data?.error_message) {
      msg = response.data.error_message;
    } else if (response?.data?.message) {
      msg = response.data.message;
    }

    this.showAlert("none", alertTitle, msg, "Voltar", null, null, null, hideHelpButton);
  }
}
