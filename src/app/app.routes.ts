import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./tabs/tabs.routes").then((m) => m.routes),
  },
  {
    path: "walkthrough",
    loadComponent: () => import("./pages/walkthrough/walkthrough.page").then((m) => m.WalkthroughPage),
  },
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.page").then((m) => m.LoginPage),
  },
  {
    path: "notifications",
    loadComponent: () => import("./pages/notifications/notifications.page").then((m) => m.NotificationsPage),
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register/register.page").then((m) => m.RegisterPage),
  },
  {
    path: "recovery-password",
    loadComponent: () => import("./pages/recovery-password/recovery-password.page").then((m) => m.RecoveryPasswordPage),
  },
  {
    path: "intro",
    loadComponent: () => import("./pages/intro/intro.page").then((m) => m.IntroPage),
  },
  {
    path: "qrcode",
    loadComponent: () => import("./pages/qrcode/qrcode.page").then((m) => m.QrcodePage),
  },
  {
    path: "sfcoke-payment",
    loadComponent: () => import("./pages/sfcoke-payment/sfcoke-payment.page").then((m) => m.SfcokePaymentPage),
  },
  {
    path: "change-information",
    loadComponent: () => import("./pages/change-information/change-information.page").then((m) => m.ChangeInformationPage),
  },
  {
    path: "blocked-outdated",
    loadComponent: () => import("./pages/blocked-outdated/blocked-outdated.page").then((m) => m.BlockedOutdatedPage),
  },
  {
    path: "maintenance",
    loadComponent: () => import("./pages/maintenance/maintenance.page").then((m) => m.MaintenancePage),
  },
];
