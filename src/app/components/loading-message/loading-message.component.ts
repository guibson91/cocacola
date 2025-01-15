import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-loading-message",
  templateUrl: "./loading-message.component.html",
  styleUrls: ["./loading-message.component.scss"],
})
export class LoadingMessageComponent implements OnInit {
  @Input({ required: true }) message: string;
  @Input({ required: true }) loading: boolean = false;
  @Input() empty: boolean;
  @Input() emptyMessage: string = "Não possui possível encontrar";

  constructor() {}

  ngOnInit() {}
}
