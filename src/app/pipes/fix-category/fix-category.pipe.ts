import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fixCategory",
})
export class FixCategoryPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== "string") return value;

    const targetValue = value.toUpperCase().trim();

    if (targetValue === "CHAS") {
      return "Chás";
    } else if (targetValue === "ENERGETICOS E HIDRATACAO") {
      return "Energéticos";
    } else if (targetValue === "AGUAS") {
      return "Águas";
    } else if (targetValue === "ENERGETICO") {
      return "Energético";
    } else {
      return value;
    }
  }
}
