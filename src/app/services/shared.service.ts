import Axios from "axios-observable";
import OneSignal, { NotificationWillDisplayEvent } from "onesignal-cordova-plugin";
import { applicationClientId, endpointBase, oneSignalAppId } from "src/main";
import { AuthResponse, Response, ResponseHeaders } from "../models/response";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BehaviorSubject, catchError, delay, from, mergeMap, Observable, of, switchMap, tap } from "rxjs";
import { Geolocation } from "@capacitor/geolocation";
import { Injectable } from "@angular/core";
import { LinkService } from "./link.service";
import { ModalController, NavController, Platform } from "@ionic/angular";
import { RegisterService } from "./register.service";
import { removeSymbol } from "../util/util";
import { StorageService } from "./storage.service";
import { User } from "../models/user";
import { Customer } from "../models/customer";

const MAX_RETRY = 3;

@Injectable({
  providedIn: "root",
})
export class SharedService {
  user?: User; //LoggedUser
  customer?: Customer; //Programa de Pontos
  accessToken?: string; //Auth token
  refreshToken?: string; //Auth refreshToken
  oneSignalId?: string;
  oneSignalToken?: string;

  user$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  customer$: BehaviorSubject<Customer | undefined> = new BehaviorSubject<Customer | undefined>(undefined);

  htmlTerms;
  htmlPrivacy;
  notifications;

  web = false;
  ios = false;

  constructor(
    public platform: Platform,
    public storage: StorageService,
    public link: LinkService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public register: RegisterService,
  ) {
    this.user$.next(undefined);
    this.listenUser();
    this.getTermsAndPrivacy();
  }

  getNotifications() {
    return this.get("register/notifications").pipe(
      tap((res) => {
        if (res?.status) {
          this.notifications = res.data;
        } else {
          this.notifications = [];
        }
      }),
    );
  }

  loadCustomer() {
    return this.get<Customer>("engine/earn/point/customer").pipe(
      tap((res) => {
        if (res.status) {
          this.customer = res.data;
          this.customer$.next(this.customer);
        }
      }),
    );
  }

  get<T>(endpoint: string, avoidParcialMaintenance?: boolean): Observable<Response<T>> {
    return this.makeRequest<T>("GET", endpoint, avoidParcialMaintenance);
  }

  post<T>(endpoint: string, data: any, isAuth = false, geolocation = false, avoidParcialMaintenance?: boolean): Observable<Response<T>> {
    const contentType = isAuth ? "urlencoded" : "json";
    return from(this.getUpdatedData(data, geolocation)).pipe(
      switchMap((updatedData) => {
        return this.makeRequest<T>("POST", endpoint, updatedData, contentType, avoidParcialMaintenance);
      }),
    );
  }

  put<T>(endpoint: string, data: any, geolocation = false, avoidParcialMaintenance?: boolean): Observable<Response<T>> {
    return from(this.getUpdatedData(data, geolocation)).pipe(
      switchMap((updatedData) => {
        return this.makeRequest<T>("PUT", endpoint, updatedData, "json", avoidParcialMaintenance);
      }),
    );
  }

  delete<T>(endpoint: string, data?: any, geolocation = false, avoidParcialMaintenance?: boolean): Observable<Response<T>> {
    return from(this.getUpdatedData(data, geolocation)).pipe(
      switchMap((updatedData) => {
        return this.makeRequest<T>("DELETE", endpoint, updatedData, "json", avoidParcialMaintenance);
      }),
    );
  }

  signin(username: string, password: string): Observable<Response<AuthResponse>> {
    const data = {
      username: username,
      password: password,
      grant_type: "password",
      client_id: applicationClientId,
    };
    return this.post<AuthResponse>("auth", data, true);
  }

  resetUser() {
    this.accessToken = "";
    this.refreshToken = "";
    this.user = undefined;
    this.register.clearClient(true);
    this.storage.set("auth", null);
    this.storage.set("currentCategory", null);
    this.storage.set("currentBrand", null);
    this.storage.set("currentProduct", null);
    this.storage.set("sessionId", null);
    this.user$.next(undefined);
  }

  logout(action: string): Observable<Response<AuthResponse>> {
    const data = {
      client_id: applicationClientId,
      refresh_token: this.refreshToken ? this.refreshToken : "",
      action,
    };
    return this.post<any>(`auth/logout?clientId=${this.user?.clientId}&action=${action}&email=${this.user?.responsible?.email}`, data, true).pipe(
      tap(() => {
        this.resetUser();
        this.navCtrl.navigateRoot("/login");
      }),
      catchError((error) => {
        this.resetUser();
        this.navCtrl.navigateRoot("/login");
        return of({
          httpStatus: null as any,
          status: false,
          message: null as any,
          data: null as any,
          maintenanceParcial: null as any,
          maintenanceTotal: null as any,
        });
      }),
    );
  }

  sendOneSignalData() {
    const obs$ =
      this.oneSignalId && this.oneSignalToken
        ? this.post("register/player-id", {
            oneSignalId: this.oneSignalId ? this.oneSignalId : "",
            oneSignalToken: this.oneSignalToken ? this.oneSignalId : "",
          })
        : of({ status: true });
    return obs$;
  }

  private refresh(): Observable<{ status: boolean }> {
    const data = {
      refresh_token: this.refreshToken,
      client_id: applicationClientId,
      grant_type: "refresh_token",
    };
    return this.post<any>("auth", data, true).pipe(
      mergeMap((response) => {
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        this.storage.set("auth", {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user,
        });
        return of({
          status: true,
        });
      }),
      catchError((error) => {
        console.error("Error refresh: ", error);
        return of({ status: false });
      }),
    );
  }

  private makeRequest<T>(method: string, endpoint: string, data?: any, contentType: "json" | "urlencoded" = "json", avoidParcialMaintenance?: boolean): Observable<Response<T>> {
    const config = this.createRequestConfig(method, endpoint, data, contentType);
    return Axios.request<Response<T>>(config).pipe(
      switchMap((response: AxiosResponse<Response<T>>) => {
        return this.handleResponse(response, avoidParcialMaintenance);
      }),
      catchError((error: AxiosError<Response<T>>) => {
        return this.handleError<T>(error, () => this.makeRequest(method, endpoint, data, contentType), 0);
      }),
    );
  }

  private createResponseData<T>(response: AxiosResponse<Response<T>>, status: boolean): Response<T> {
    const headers = response.headers as ResponseHeaders;
    return {
      httpStatus: response.status,
      status: status,
      message: response.data.message || "",
      data: response.data.data,
      maintenanceParcial: headers["x-maintenance-partial"] === "true",
      maintenanceTotal: headers["x-maintenance-total"] === "true",
    };
  }

  private handleResponse<T>(response: AxiosResponse<Response<T>>, avoidParcialMaintenance?: boolean): Observable<Response<T>> {
    const headers = response.headers;
    if (headers["x-maintenance-total"]) {
      this.handleMaintenance<T>(response, headers);
    }
    if (headers["x-maintenance-partial"] && !avoidParcialMaintenance) {
      this.handleMaintenance<T>(response, headers);
    }
    const data = this.createResponseData(response, true);
    return of(data);
  }

  private handleMaintenance<T>(response, headers) {
    this.navCtrl.navigateRoot("/maintenance");
    return of({
      httpStatus: response.status,
      status: false,
      message: response.data.message || "",
      data: response.data.data as T,
      maintenanceParcial: headers["x-maintenance-partial"] === "true",
      maintenanceTotal: headers["x-maintenance-total"] === "true",
    });
  }

  private createRequestConfig<T>(method: string, endpoint: string, data?: any, contentType: "json" | "urlencoded" = "json"): AxiosRequestConfig {
    const headers = {
      "Content-Type": contentType === "json" ? "application/json" : "application/x-www-form-urlencoded",
      Authorization: `Bearer ${this.accessToken && contentType === "json" ? this.accessToken : ""}`,
    };
    return {
      method: method,
      url: `${endpointBase}/${endpoint}`,
      headers: headers,
      data: contentType === "json" ? data : new URLSearchParams(data).toString(),
    };
  }

  private handleError<T>(error: AxiosError<Response<T>>, originalRequest: () => Observable<Response<T>>, retryCount: number = 0): Observable<Response<T>> {
    if (error.response?.status === 401 && !this.refreshToken) {
      console.error("Request response 401, mas user não possui refreshToken");
      this.logout("NO_REFRESH_TOKEN").subscribe(); // Logout on token expiration
      return of({
        httpStatus: error.response?.status,
        status: false,
        message: error.response?.data?.message as any,
        data: error.response?.data,
        maintenanceParcial: error.response?.headers["x-maintenance-partial"] === "true",
        maintenanceTotal: error.response?.headers["x-maintenance-total"] === "true",
      } as Response<T>);
    } else if (error.response?.status === 401 && this.refreshToken) {
      if (retryCount < MAX_RETRY) {
        return this.refresh().pipe(
          switchMap((refreshResponse) => {
            if (refreshResponse.status) {
              return originalRequest();
            } else {
              const delayTime = Math.pow(2, retryCount + 1) * 1000; // Calculate the delay for the next retry
              console.error(`Token refresh failed ${retryCount + 1}x de ${MAX_RETRY}, retrying after ${delayTime}ms`);
              return of(null).pipe(
                delay(delayTime),
                mergeMap(() => this.handleError(error, originalRequest, retryCount + 1)),
              );
            }
          }),
          catchError((innerError) => {
            this.logout("PERSISTENT_FAILURE").subscribe(); // Logout on persistent failure
            return of({
              httpStatus: innerError.response?.status,
              status: false,
              message: "Token refresh failed after retries",
              data: innerError.response?.data,
              maintenanceParcial: innerError.response?.headers["x-maintenance-partial"] === "true",
              maintenanceTotal: innerError.response?.headers["x-maintenance-total"] === "true",
            } as Response<T>);
          }),
        );
      } else {
        this.logout("MAX_RETRIES").subscribe(); // Force logout after max retries
        return of({
          httpStatus: error.response?.status,
          status: false,
          message: "Token refresh failed after maximum retries",
          data: error.response?.data,
          maintenanceParcial: error.response?.headers["x-maintenance-partial"] === "true",
          maintenanceTotal: error.response?.headers["x-maintenance-total"] === "true",
        } as Response<T>);
      }
    } else {
      return of({
        httpStatus: error.response?.status,
        status: false,
        message: error.response?.data?.message ?? "",
        data: error.response?.data,
        maintenanceParcial: error.response?.headers["x-maintenance-partial"] === "true",
        maintenanceTotal: error.response?.headers["x-maintenance-total"] === "true",
      } as Response<T>);
    }
  }

  private listenUser() {
    this.user$.subscribe((u) => {
      this.user = u;
      if (this.user?.clientId && this.platform.is("capacitor")) {
        const phone = this.user.responsible?.cellphone ? this.user.responsible?.cellphone : "";
        const email = this.user.responsible?.email ? this.user.responsible?.email : "";
        const formmatedPhone = phone ? "+55" + removeSymbol(phone) : "";
        OneSignal.login(this.user.clientId);
        OneSignal.User.addEmail(email);
        OneSignal.User.addSms(formmatedPhone);
      }
    });
  }

  initOneSignal() {
    if (!this.platform.is("capacitor")) {
      console.info("Platform não é capacitor");
      return;
    }
    OneSignal.initialize(oneSignalAppId);
    OneSignal.User.pushSubscription.addEventListener("change", (event) => {
      if (event.current) {
        this.oneSignalId = event.current.id;
        this.oneSignalToken = event.current.token;

        this.storage.set("onesignal", {
          oneSignalId: this.oneSignalId,
          oneSignalToken: this.oneSignalToken,
        });
      }
    });
    OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event: NotificationWillDisplayEvent) => {
      console.info("foregroundWillDisplay: ", event);
    });
    OneSignal.Notifications.addEventListener("click", (event) => {
      console.info("notificationData clicked: ", event);
    });
    OneSignal.Notifications.addEventListener("permissionChange", (event) => {
      console.info("permissionChange: ", event);
    });
    OneSignal.Notifications.requestPermission(true).then((accepted: boolean) => {});
  }

  async initUserLocation() {
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location === "granted") {
      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      if (coordinates?.coords?.latitude && coordinates?.coords?.longitude) {
        return {
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        };
      } else {
        return {
          latitude: 0,
          longitude: 0,
        };
      }
    } else {
      return {
        latitude: 0,
        longitude: 0,
      };
    }
  }

  private async getUpdatedData(data: any, geolocation?: boolean) {
    if (!data) {
      data = {};
    }
    try {
      if (geolocation) {
        const coords: { latitude: number; longitude: number } = await this.initUserLocation();

        if (coords.latitude && coords.longitude) {
          data.latitude = coords.latitude;
          data.longitude = coords.longitude;
        }
      }
    } catch (err) {
      console.error("Error initUserLocation: ", err);
    }
    if (this.oneSignalId) {
      data.oneSignalId = this.oneSignalId;
    }
    if (this.oneSignalToken) {
      data.oneSignalToken = this.oneSignalToken;
    }

    return data;
  }

  private getTermsAndPrivacy() {
    this.get<{ terms: string; privacy: string }>("terms-and-privacy", true).subscribe((res) => {
      if (res?.data) {
        this.htmlTerms = res.data.terms;
        this.htmlPrivacy = res.data.privacy;
      }
    });
  }
}
