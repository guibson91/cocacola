import localePt from "@angular/common/locales/pt";
import { enableProdMode, importProvidersFrom, LOCALE_ID } from "@angular/core";
import { AppComponent } from "./app/app.component";
import { bootstrapApplication } from "@angular/platform-browser";
import { environment } from "./environments/environment";
import { File } from "@awesome-cordova-plugins/file/ngx";
import { FileOpener } from "@awesome-cordova-plugins/file-opener/ngx";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { PreviewAnyFile } from "@awesome-cordova-plugins/preview-any-file/ngx";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, Router, RouteReuseStrategy } from "@angular/router";
import { register } from "swiper/element/bundle";
import { registerLocaleData } from "@angular/common";
import { routes } from "./app/app.routes";
import { Storage } from "@ionic/storage";
import { EnvironmentType } from "@app/models/env";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";

registerLocaleData(localePt);

register();

if (environment === "production") {
  enableProdMode();
}

export const firebaseConfig = {
  apiKey: "AIzaSyBoLKXqHcrqngRbR4X-Mvr4X-DgYH2TGXQ",
  authDomain: "carteira-3f277.firebaseapp.com",
  databaseURL: "https://carteira-3f277.firebaseio.com",
  projectId: "carteira-3f277",
  storageBucket: "carteira-3f277.appspot.com",
  messagingSenderId: "688662940834",
  appId: "1:688662940834:web:ccb4f64305dac60bdddbfb",
  measurementId: "G-WX7174Q3XL",
};

const BASE_DEVELOPMENT = "https://srefrescos.development.supermup.com.br/api"; //MobiUp
const BASE_HOMOLOG = "https://srefrescos.homolog.supermup.com.br/api"; //SR (TI)
const BASE_HEXT = "https://srefrescos.hext.supermup.com.br/api"; //SR (Negócios)
const BASE_PRODUCTION = "https://srefrescos.production.supermup.com.br/api"; //Produção

export const endpointBase =
  environment === EnvironmentType.development
    ? BASE_DEVELOPMENT
    : environment === EnvironmentType.homolog
      ? BASE_HOMOLOG
      : environment === EnvironmentType.hext
        ? BASE_HEXT
        : BASE_PRODUCTION;

export const applicationClientId =
  environment === EnvironmentType.development
    ? "f780d3e736509b548e11f19f2d50a4610822a086"
    : environment === EnvironmentType.homolog
      ? "da39a3ee5e6b4b0d3255bfef95601890afd80709"
      : environment === EnvironmentType.hext
        ? "3a3911235d101c58b501e54259d708829865f331"
        : "0985d8bac94af7ebf3123025843223abd4932b8a";

export const encryptKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCRAt4G3LCUiWtOAFBm8rhyoyWC1p3O5HMraqC98MyvEXO+D7pe9L+9sZRw6ARMz7kXGvVavTjxK/GYKmnVmJfMI28m/CQVWrhh9JOSytySEN107dd1nnLbYAJEsYdjD2R6RuFz5U6pHckvnaxonJ1N/iVuXSFTNhBG2H5uT9ezmwIDAQAB";

//OneSignal
export const oneSignalAppId: string = "4d26bcd2-9239-4a10-a7fe-8817af9ea172";
export const oneSignalSenderId: string = "936461291540";

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: "pt-BR" },
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(IonicModule.forRoot({ mode: "md" })),
    provideRouter(routes),
    InAppBrowser,
    FileOpener,
    File,
    Storage,
    PreviewAnyFile,
    provideAnimations(),
  ],
});
