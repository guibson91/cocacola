import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { SharedService } from "./shared.service";
import { Observable, catchError, from, of, switchMap, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GetnetService {
  sessionId: string | null;

  constructor(private shared: SharedService) {}

  generateSessionId(user): Observable<string | null> {
    if (!user || !user.clientId) {
      return of(null);
    }
    const rowSessionId = user.clientId + "|" + new Date().getTime();
    this.sessionId = CryptoJS.MD5(rowSessionId).toString();
    return of(this.sessionId);
  }

  loadSessionId(): Observable<string | null> {
    if (this.sessionId) {
      return of(this.sessionId);
    } else {
      return from(this.shared.storage.get("sessionId")).pipe(
        switchMap((sessionId: string) => {
          if (sessionId) {
            this.sessionId = sessionId;
            return of(this.sessionId);
          } else if (this.shared.user) {
            return this.generateSessionId(this.shared.user).pipe(
              tap((newSessionId) => {
                this.sessionId = newSessionId;
              }),
            );
          } else {
            throw new Error("Não foi possível gerar sessionId");
          }
        }),
        catchError((error) => {
          return of(null);
        }),
      );
    }
  }
}
