import { Pipe, PipeTransform } from "@angular/core";
import { Extract } from "@app/models/extract";

@Pipe({
  name: "titleExtract",
})
export class TitleExtractPipe implements PipeTransform {
  transform(extract: Extract): string {
    if (!extract || !extract.typeBalance) {
      return "";
    }
    if (extract.typeBalance.name === "processed") {
      return "Compra no Orbitta";
    } else if (extract.typeBalance.name === "event") {
      return `${extract.description}`;
    } else if (extract.typeBalance.name === "redeem") {
      return "Resgate";
    } else {
      return extract.description || "";
    }
  }
}
