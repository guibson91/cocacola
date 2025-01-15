import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { BiometryType, NativeBiometric } from "capacitor-native-biometric";
import { CartService } from "../services/cart.service";
import { catchError, finalize, first, map, switchMap } from "rxjs/operators";
import { combineLatest, from, Observable, of } from "rxjs";
import { GetnetService } from "../services/getnet.service";
import { Injectable, NgZone } from "@angular/core";
import { LoadingService } from "../services/loading.service";
import { SharedService } from "../services/shared.service";
import { UpdateService } from "../services/update.service";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  private biometricAuthenticated = false;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private shared: SharedService,
    private loadingService: LoadingService,
    private cart: CartService,
    private getnet: GetnetService,
    private update: UpdateService,
  ) {
    this.initializeStorage();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.verifyAppIsUpdated().pipe(
      switchMap((isUpdated) => {
        if (!isUpdated) {
          this.router.navigateByUrl("/blocked-outdated");
          return this.update.openAppStore().pipe(map(() => false));
        }
        return this.performAuthentication();
      }),
      catchError(() => this.performAuthentication()),
    );
  }

  private performAuthentication(): Observable<boolean> {
    if (this.biometricAuthenticated) {
      return of(true);
    }

    return from(this.performBiometricVerification()).pipe(
      switchMap((biometricResult) => {
        if (!biometricResult) {
          this.redirectUnauthenticatedUser();
          return of(false);
        }
        this.biometricAuthenticated = true;
        return this.shared.user$.pipe(
          first(),
          switchMap((user) => {
            if (!user || !this.getnet.sessionId) {
              this.loadingService.loading$.next(true);
            }
            return this.checkAndUpdateUser(user);
          }),
        );
      }),
    );
  }

  private checkAndUpdateUser(user?: User | null): Observable<boolean> {
    const userObservable = user
      ? of(user)
      : from(this.shared.storage.get("auth")).pipe(
          switchMap((auth) => {
            if (auth) {
              this.shared.accessToken = auth.accessToken;
              this.shared.refreshToken = auth.refreshToken;
              this.shared.user = auth.user;
              return of(auth.user);
            } else {
              return of(null);
            }
          }),
        );

    return userObservable.pipe(
      switchMap((authenticatedUser: User) => {
        if (!authenticatedUser) {
          this.redirectUnauthenticatedUser();
          setTimeout(() => {
            this.loadingService.loading$.next(false);
          }, 4000);
          return of(false);
        }
        this.shared.user$.next(authenticatedUser as User);

        return this.getnet.loadSessionId().pipe(switchMap(() => this.loadInitialData()));
      }),
    );
  }

  private async performBiometricVerification(): Promise<boolean> {
    if (!this.shared.platform.is("cordova") && !this.shared.platform.is("capacitor")) {
      return true;
    }
    const biometricEnabled = await this.shared.storage.get("biometric");

    if (!biometricEnabled) {
      return true;
    }
    const result = await NativeBiometric.isAvailable();

    if (!result.isAvailable) {
      return true;
    }
    const isFaceID = result.biometryType === BiometryType.FACE_ID;

    const verified = await NativeBiometric.verifyIdentity({
      reason: isFaceID ? "Verificação facial" : "Verificação biométrica",
      title: isFaceID ? "Verificação facial" : "Verificação biométrica",
      subtitle: isFaceID ? "Verifique sua face" : "Verifique sua digital",
      description: "",
      maxAttempts: 5,
      useFallback: true,
    })
      .then(() => true)
      .catch(() => false);

    return verified;
  }

  private redirectUnauthenticatedUser(): void {
    this.ngZone.run(() => {
      this.shared.storage.get("introViewed").then((res) => {
        if (res) {
          this.router.navigateByUrl("/login");
        } else {
          this.router.navigateByUrl("/intro");
        }
      });
    });
  }

  private loadInitialData(): Observable<boolean> {
    const localCategories = this.cart.categories();
    if (!localCategories || localCategories.length === 0) {
      return this.shared.sendOneSignalData().pipe(
        switchMap((res) => {
          if (res && res.status) {
            return combineLatest([this.cart.loadData(), this.shared.getNotifications(), this.shared.loadCustomer()]).pipe(
              map(() => true),
              catchError((error) => {
                console.error("Erro ao carregar dados iniciais:", error);
                this.loadingService.loading$.next(false);
                return of(false);
              }),
              finalize(() => {
                setTimeout(() => {
                  this.loadingService.loading$.next(false);
                }, 200);
              }),
            );
          } else {
            this.loadingService.loading$.next(false);
            return of(false);
          }
        }),
        catchError((error) => {
          console.error("Erro na obtenção de notificações:", error);
          this.loadingService.loading$.next(false);
          return of(false);
        }),
        finalize(() => {
          this.loadingService.loading$.next(false);
        }),
      );
    } else {
      this.loadingService.loading$.next(false);
      return of(true);
    }
  }

  private verifyAppIsUpdated(): Observable<boolean> {
    return from(this.shared.platform.ready()).pipe(
      switchMap(() => combineLatest([this.update.getAvailableAppVersion(), this.update.getCurrentAppVersion()])),
      map(([availableVersion, currentVersion]) => {
        if (Number(currentVersion) < Number(availableVersion)) {
          return false;
        }
        return true;
      }),
    );
  }

  private initializeStorage(): void {
    this.shared.storage.init().catch((err) => console.error("Erro ao inicializar o armazenamento:", err));
  }
}
