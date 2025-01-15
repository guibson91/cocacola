import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
})
export class LoaderComponent implements OnInit {
  @Input({ required: true }) loadingMessage = "Carregando suas mensagens...";
  @Input({ required: true }) emptyMessage = "Você ainda não possui conexões";
  @Input({ required: true }) entity: any;

  constructor() {}

  ngOnInit() {}
}
