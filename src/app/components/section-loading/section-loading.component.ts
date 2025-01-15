import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-section-loading",
  templateUrl: "./section-loading.component.html",
  styleUrls: ["./section-loading.component.scss"],
})
export class SectionLoadingComponent implements OnInit {
  @Input({ required: true }) message: string;
  @Input({ required: true }) loading: boolean = false;
  @Input() margin = "1em";

  constructor() {}

  ngOnInit() {}
}
