import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fromNow",
})
export class FromNowPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
