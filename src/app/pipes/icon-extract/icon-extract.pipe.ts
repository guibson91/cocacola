import { Pipe, PipeTransform } from "@angular/core";
import { Extract } from "@app/models/extract";

@Pipe({
  name: "iconExtract",
})
export class IconExtractPipe implements PipeTransform {
  transform(extract: Extract): string {
    if (!extract || !extract.typeBalance) {
      return "assets/svgs/extrato_compra_orbitta.svg";
    }
    if (extract.typeBalance.name === "processed") {
      return "assets/svgs/extrato_compra_orbitta.svg";
    } else if (extract.typeBalance.name === "event") {
      return "assets/svgs/extrato_bonus.svg";
    } else if (extract.typeBalance.name === "redeem") {
      return "assets/svgs/extrato_resgate.svg";
    } else {
      return "assets/svgs/extrato_compra_orbitta.svg";
    }
  }
}
