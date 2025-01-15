import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { Injectable } from "@angular/core";
import { SharedService } from "./shared.service";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  public loading$ = new ReplaySubject<boolean>(1);
  public loadingCart$ = new ReplaySubject<boolean>(1);

  constructor(public shared: SharedService) {
    this.loading$.next(false);
    this.loadingCart$.next(false);
  }
}
