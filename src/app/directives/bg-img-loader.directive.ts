import { ChangeDetectorRef, Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";

/**
 * Utilizar em um elemento qualquer que a imagem seja renderizada como background
 */
@Directive({
  selector: "[bgImg]",
})
export class BackgroundImagePreLoaderDirective implements OnInit {
  @Input("bgImg") targetSource: string = "";
  defaultImage = "assets/gifs/loading.gif";
  downloadingImage: any;
  finalImage: any;
  oldImage: any;

  constructor(
    public ref: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.handleImage();
  }

  handleImage() {
    this.finalImage = `url(${this.defaultImage})`;
    this.applyBackgroundImage();

    if (!this.targetSource) {
      this.finalImage = "url(assets/images/placeholders/placeholder.png)";
      this.oldImage = this.finalImage;
      this.applyBackgroundImage();
    }

    this.downloadingImage = new Image();
    this.downloadingImage.onload = () => {
      this.finalImage = `url(${this.targetSource})`;
      this.oldImage = this.finalImage;
      this.applyBackgroundImage();
    };
    this.downloadingImage.onerror = (err: any) => {
      this.finalImage = "url(assets/images/placeholders/placeholder.png)";
      this.oldImage = this.finalImage;
      this.applyBackgroundImage();
    };
    this.downloadingImage.src = this.targetSource;
  }

  applyBackgroundImage() {
    this.renderer.setStyle(this.el.nativeElement, "backgroundImage", this.finalImage);
    this.ref.detectChanges();
  }
}
