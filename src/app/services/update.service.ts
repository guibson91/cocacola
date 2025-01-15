import { AppUpdate } from "@capawesome/capacitor-app-update";
import { from, map, Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UpdateService {
  constructor() {}

  getCurrentAppVersion(): Observable<string> {
    return from(AppUpdate.getAppUpdateInfo()).pipe(map((result) => result.currentVersion));
  }

  getAvailableAppVersion(): Observable<string> {
    return from(AppUpdate.getAppUpdateInfo()).pipe(map((result) => result.availableVersion));
  }

  openAppStore(): Observable<void> {
    return from(AppUpdate.openAppStore());
  }
}
