import { ChangeDetectorRef, Directive, Input, OnInit } from "@angular/core";

/**
 * Utilizar no element <img [img]='' />
 */
@Directive({
  selector: "[img]",
  host: {
    "[attr.src]": "finalImage",
  },
})
export class ImagePreLoaderDirective implements OnInit {
  @Input("img") targetSource: string = "";
  defaultImage = "assets/gifs/loading.gif";
  downloadingImage: any;
  finalImage: any;
  oldImage: any;
  constructor(public ref: ChangeDetectorRef) {}
  ngOnInit() {
    this.handleImage();
  }
  handleImage() {
    this.finalImage = this.defaultImage;

    if (!this.targetSource) {
      this.finalImage = "assets/images/placeholders/placeholder.png";
      this.oldImage = this.finalImage;
      this.ref.detectChanges();
    }
    this.downloadingImage = new Image();
    this.downloadingImage.onload = () => {
      this.finalImage = this.targetSource;
      this.oldImage = this.finalImage;
      this.ref.detectChanges();
    };
    this.downloadingImage.onerror = (err: any) => {
      this.finalImage = "assets/images/placeholders/placeholder.png";
      this.oldImage = this.finalImage;
      this.ref.detectChanges();
    };
    this.downloadingImage.src = this.targetSource;
  }
}
