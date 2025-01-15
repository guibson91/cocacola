import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-section-info",
  templateUrl: "./section-info.component.html",
  styleUrls: ["./section-info.component.scss"],
})
export class SectionInfoComponent implements OnInit {
  @Input({ required: true }) title;
  @Input() description;
  @Input() margin = "1em";

  constructor() {}

  ngOnInit() {}
}
