import { Subscription } from "rxjs";
import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { getBackgroundImage } from "src/app/util/image";
import { BaseComponent } from "../base/base.component";
import { LoadingService } from "src/app/services/loading.service";

@Component({
  selector: "app-bg-image",
  templateUrl: "./bg-image.component.html",
  styleUrls: ["./bg-image.component.scss"],
})
export class BgImageComponent extends BaseComponent implements AfterViewInit {
  @Input({ required: true }) image?: string;
  @Input({ required: true }) width?: string;
  @Input({ required: true }) height?: string;
  @Input() size: "small" | "normal" = "normal";
  @Input() type: "round" | "square" | "square-round" | "square-round-bottom" = "square-round";
  @Input() data?: any; //Para output no clique da imagem
  @Input() small?: boolean = false;
  @Input() padding?: boolean;
  @Input() round = false;
  @Input() placeholderType: "default" | "profile-user" | "profile-default" = "default";
  @Output() click = new EventEmitter();
  @Input() showLoadingSpinner = false;

  realImage?: string;
  userSubscription?: Subscription;

  loading = false;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.handleBackgroundImage();
    this.loadingService.loadingCart$.subscribe((res) => {
      this.loading = res ? res : false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async handleBackgroundImage() {
    const url = await getBackgroundImage(this.image, this.placeholderType);
    this.realImage = url;
    this.ref.markForCheck();
  }

  openImage() {
    if (this.loading) {
      return;
    }
    this.click.emit(this.data);
  }
}
