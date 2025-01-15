import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-empty-message",
  templateUrl: "./empty-message.component.html",
  styleUrls: ["./empty-message.component.scss"],
})
export class EmptyMessageComponent implements OnInit {
  @Input({ required: true }) show = false;
  @Input({ required: true }) message;

  constructor() {}

  ngOnInit() {}
}
