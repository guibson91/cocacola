import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-stepper",
  templateUrl: "./stepper.component.html",
  styleUrls: ["./stepper.component.scss"],
})
export class StepperComponent extends BaseComponent implements OnInit, OnChanges {
  @Input({ required: true }) labels: string[];

  @Input({ required: true }) stepIndex: number;

  @Input() marginTop: string = "4em";

  constructor() {
    super();
  }

  ngOnInit(): void {
    const max = this.labels.length - 1;
    if (this.stepIndex > max) {
      throw Error("O stepIndex excedeu o tamanho máximo do array");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["stepIndex"] && changes["stepIndex"].previousValue !== changes["stepIndex"].currentValue) {
      this.ref.detectChanges();
    }
  }
}
