import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { countWords } from "src/app/util/util";

@Component({
  selector: "app-item-info",
  templateUrl: "./item-info.component.html",
  styleUrls: ["./item-info.component.scss"],
})
export class ItemInfoComponent implements OnInit {
  @Input({ required: true }) title: string;
  @Input() description?: string;
  @Input() showBorder = true;
  @Input() minWidth = "4em";
  @Input() showButton = false;
  @Input() labelButton = "Alterar";
  @Output() clickEvent = new EventEmitter();
  @Input() page: string;

  constructor() {}

  ngOnInit() {}

  //Verificar se é uma única palavra muito longa (como um email)
  get isLong(): boolean {
    if (!this.description) {
      return false;
    }
    const wordsQuantity = countWords(this.description);
    if (wordsQuantity === 1 && this.description.length > 20) {
      return true;
    } else {
      return false;
    }
  }

  clickBtn() {
    this.clickEvent.emit();
  }
}
