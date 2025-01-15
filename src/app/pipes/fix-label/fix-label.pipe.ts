import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fixLabel",
})
export class FixLabelPipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) {
      return "";
    } else {
      return value;
    }
    // else if (typeof value !== "string") {
    //   return "";
    // } else if (value.length === 1) {
    //   return value.toUpperCase();
    // } else {
    //   return value[0].toUpperCase() + value.slice(1).toLowerCase();
    // }
  }
}
