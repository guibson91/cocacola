import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Swiper } from "swiper";
import { BaseComponent } from "src/app/components/base/base.component";
import { ComponentsModule } from "src/app/components/components.module";

@Component({
  selector: "app-walkthrough",
  templateUrl: "./walkthrough.page.html",
  styleUrls: ["./walkthrough.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WalkthroughPage extends BaseComponent {
  @ViewChild("swiper") swiperRef: ElementRef;
  swiper: Swiper;
  currentIndex = 0;

  steps = [
    {
      image: "assets/svgs/newslide1.svg",
      title: "Maior liberdade",
      description: "Aqui você pode comprar a qualquer momento em qualquer lugar.",
    },
    {
      image: "assets/svgs/newslide2.svg",
      title: "Abasteça seu negócio",
      description: "Abastecer seu estoque com produtos Coca-Cola e muito mais.",
    },
    {
      image: "assets/svgs/newslide3.svg",
      title: "Melhor para você",
      description: "Escolher a melhor data e modalidade de entrega.",
    },
    {
      image: "assets/svgs/newslide4.svg",
      title: "Vantagens e benefícios",
      description: "Ter acesso a vantagens e benefícios nas suas compras.",
    },
  ];

  constructor() {
    super();
  }

  handleShadowRoot() {
    const el = this.swiperRef?.nativeElement;
    if (el && el.shadowRoot) {
      const swiperContainer = el.shadowRoot;
      if (swiperContainer) {
        const swiperButtonPrev = swiperContainer.querySelector(".swiper-button-prev");
        const swiperButtonNext = swiperContainer.querySelector(".swiper-button-next");

        if (swiperButtonPrev && swiperButtonPrev.classList.contains("swiper-button-disabled")) {
          swiperButtonPrev.setAttribute("style", "visibility: hidden;");
        } else {
          swiperButtonPrev.setAttribute("style", "visibility: visible;");
        }
        if (swiperButtonNext && swiperButtonNext.classList.contains("swiper-button-disabled")) {
          swiperButtonNext.setAttribute("style", "visibility: hidden;");
        } else {
          swiperButtonNext.setAttribute("style", "visibility: visible;");
        }
      }
    }
  }

  swiperReady() {
    setTimeout(() => {
      const el = this.swiperRef?.nativeElement;
      if (el && el.swiper) {
        this.swiper = el.swiper;
        this.handleShadowRoot();
        // const swiperContainer = el.shadowRoot;
        // if (swiperContainer) {
        //   const swiperButtonPrev = swiperContainer.querySelector(".swiper-button-prev");
        //   const swiperButtonNext = swiperContainer.querySelector(".swiper-button-next");
        //
        //   if (swiperButtonPrev && swiperButtonPrev.classList.contains("swiper-button-disabled")) {
        //     swiperButtonPrev.setAttribute("style", "visibility: hidden;");
        //   } else {
        //     swiperButtonPrev.setAttribute("style", "visibility: visible;");
        //   }
        //   if (swiperButtonNext && swiperButtonNext.classList.contains("swiper-button-disabled")) {
        //     swiperButtonNext.setAttribute("style", "visibility: hidden;");
        //   } else {
        //     swiperButtonNext.setAttribute("style", "visibility: visible;");
        //   }
        // }
      }
    }, 200);
  }

  slideChanged() {
    this.currentIndex = this.swiper.activeIndex ? this.swiper.activeIndex : 0;
    this.handleShadowRoot();
  }

  openHome() {
    this.storage.set("walkthroughViewed", true);
    this.openPage("tabs/home");
  }
}
