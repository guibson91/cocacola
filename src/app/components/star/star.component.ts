import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-star",
  templateUrl: "./star.component.html",
  styleUrls: ["./star.component.scss"],
})
export class StarComponent extends BaseComponent {
  @Input() rating;
  @Input() color = "primary";
  @Input() size = "2em";
  @Input() edit: boolean = false;

  @Output() changeRating = new EventEmitter();

  constructor() {
    super();
  }

  changeStar(star: number) {
    if (this.edit) {
      this.rating = star;
      this.changeRating.emit(star);
      this.ref.detectChanges();
    }
  }
}
