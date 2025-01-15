import { Component, Input, OnDestroy } from "@angular/core";
import { BaseComponent } from "../../base/base.component";

@Component({
  selector: "app-base-modal",
  templateUrl: "./base-modal.component.html",
  styleUrls: ["./base-modal.component.scss"],
})
export class BaseModalComponent extends BaseComponent {
  @Input() showClose: boolean = true;
  @Input() remainBlur = false;

  constructor() {
    super();
    this.system.closeModal$.subscribe(() => {
      this.closeModal();
    });
  }

  ngAfterViewInit(): void {
    if (this.shared.web && this.router.url !== "/tabs/cart") {
      setTimeout(() => {
        this.system.blur = true;
      }, 100);
    } else {
      this.system.blur = false;
    }
  }

  closeModal(role?: string, data?: any, action?: Function) {
    if (this.remainBlur) {
      this.system.blur = true;
    } else {
      this.system.blur = false;
    }
    if (action) {
      action();
    }
    this.system.modalCtrl.dismiss(data, role);
  }
}
