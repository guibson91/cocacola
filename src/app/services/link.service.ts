import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { Injectable } from "@angular/core";
import { LoadingController, Platform } from "@ionic/angular";
import { PreviewAnyFile } from "@awesome-cordova-plugins/preview-any-file/ngx";

@Injectable({
  providedIn: "root",
})
export class LinkService {
  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    public loadingCtrl: LoadingController,
    private previewAnyFile: PreviewAnyFile,
  ) {}

  openLink(link: string) {
    if (!link) {
      return;
    }
    //ANDROID
    if (this.platform.is("android")) {
      const ref = this.iab.create(link, "_system", {
        hidenavigationbuttons: "yes",
        hideurlbar: "yes",
        hidden: "yes",
        location: "no",
        toolbar: "no",
        zoom: "no",
        fullscreen: "yes",
      });
      ref.show();
    }
    //iOS
    else if (this.platform.is("ios")) {
      const ref = this.iab.create(link, "_system", {
        hidenavigationbuttons: "yes",
        hideurlbar: "no",
        hidden: "yes",
        location: "yes",
        toolbar: "yes",
        zoom: "no",
        fullscreen: "yes",
      });
      ref.show();
    }
    //BROWSER
    else {
      this.openBrowserLink(link);
    }
  }

  openPDF(url: string) {
    if (this.platform.is("cordova") || this.platform.is("capacitor")) {
      this.openNativePDF(url);
    } else {
      this.openBrowserPDF(url);
    }
  }

  private openBrowserLink(url: string) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = url;
    link.setAttribute("visibility", "hidden");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  private openBrowserPDF(url: string) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = url;
    link.setAttribute("visibility", "hidden");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  private async openNativePDF(url) {
    const loading = await this.loadingCtrl.create({});
    loading.present();
    this.previewAnyFile
      .previewPath(url, {
        mimeType: "application/pdf",
      })
      .subscribe({
        next: (res) => {
          loading.dismiss();
        },
        error: (error) => {
          loading.dismiss();
          console.error("Error: ", error);
        },
      });
  }
}
