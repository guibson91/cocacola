import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { deburr } from "lodash";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  @Input({ required: true }) list: any[] = [];
  @Input({ required: true }) filters: string[];
  @Input({ required: true }) placeholder: string;

  @Output() filterList = new EventEmitter();

  listFilter: any[] = [];
  constructor() {}

  ngOnInit() {}

  initializeItems(): void {
    if (!this.list) {
      return;
    }
    this.listFilter = [];
  }

  filter(evt: any) {
    if (!this.list) {
      return;
    }
    this.initializeItems();

    const searchTerm = deburr(String(evt.srcElement.value));
    if (!searchTerm || searchTerm.length < 2) {
      this.filterList.emit(this.list);
      return;
    }

    this.listFilter = this.list.filter((element) => {
      for (const attr of this.filters) {
        if (attr && element[attr]) {
          const normalizedAttr = deburr(String(element[attr]).toLowerCase());
          const normalizedSearchTerm = deburr(searchTerm.toLowerCase());
          if (normalizedAttr.includes(normalizedSearchTerm)) {
            return true;
          }
        }
      }
      return false;
    });
    this.filterList.emit(this.listFilter);
  }
}
