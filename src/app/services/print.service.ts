import { Injectable } from "@angular/core";
import * as dti from "dom-to-image";

@Injectable({
  providedIn: "root",
})
export class PrintService {
  print(componentName: string) {
    const node = document.getElementById(componentName) as HTMLElement;
    dti.DomToImage.toPng(node)
      .then((dataUrl: string) => {
        const popup = window.open();
        if (popup) {
          popup.document.write("<img src=" + dataUrl + ">");
          popup.document.close();
          popup.focus();
          popup.print();
          popup.close();
        }
      })
      .catch((error: any) => {
        console.error("oops, something went wrong!", error);
      });
  }
}
