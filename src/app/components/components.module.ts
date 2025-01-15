import { AlertComponent } from "./modals/alert/alert.component";
import { BackgroundImagePreLoaderDirective } from "../directives/bg-img-loader.directive";
import { BaseModalComponent } from "./modals/base-modal/base-modal.component";
import { BgImageComponent } from "./bg-image/bg-image.component";
import { CardCreateComponent } from "./modals/card-create/card-create.component";
import { CardSelectComponent } from "./modals/card-select/card-select.component";
import { CardUserComponent } from "./card-user/card-user.component";
import { CartContentComponent } from "./modals/cart-content/cart-content.component";
import { CategoryItemComponent } from "./category-item/category-item.component";
import { CommonModule } from "@angular/common";
import { ContainerWebComponent } from "./container-web/container-web.component";
import { ContainerWithMenuComponent } from "./container-with-menu/container-with-menu.component";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { EmptyMessageComponent } from "./empty-message/empty-message.component";
import { FilterProductsComponent } from "./modals/filter-products/filter-products.component";
import { FilterProductsContentComponent } from "./filter-products-content/filter-products-content.component";
import { FooterCartComponent } from "./footer-cart/footer-cart.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "./header/header.component";
import { HeaderWebComponent } from "./header-web/header-web.component";
import { ImagePreLoaderDirective } from "../directives/img-loader.directive";
import { IonicModule } from "@ionic/angular";
import { ItemInfoComponent } from "./item-info/item-info.component";
import { LoaderComponent } from "./loader/loader.component";
import { LoadingComponent } from "./loading/loading.component";
import { LoadingMessageComponent } from "./loading-message/loading-message.component";
import { LoanDetailComponent } from "./modals/loan-detail/loan-detail.component";
import { MaskitoModule } from "@maskito/angular";
import { MenuContentComponent } from "./modals/menu-content/menu-content.component";
import { MenuItemsComponent } from "./menu-items/menu-items.component";
import { NotificationCartAliveComponent } from "./notification-cart-alive/notification-cart-alive.component";
import { NotificationContentComponent } from "./modals/notification-content/notification-content.component";
import { OrderSummaryComponent } from "./order-summary/order-summary.component";
import { PaymentMethodsComponent } from "./payment-methods/payment-methods.component";
import { PipesModule } from "../pipes/pipes.module";
import { PixComponent } from "./modals/pix/pix.component";
import { PlusMinusComponent } from "./products/plus-minus/plus-minus.component";
import { ProductDefaultComponent } from "./products/product-default/product-default.component";
import { ProductDetailHeaderComponent } from "./product-detail-header/product-detail-header.component";
import { ProductsComponent } from "./products/products.component";
import { RatingComponent } from "./modals/rating/rating.component";
import { RebuyComponent } from "./rebuy/rebuy.component";
import { ReturnableComponent } from "./modals/returnable/returnable.component";
import { ScalableComponent } from "./modals/scalable/scalable.component";
import { ScalableContentComponent } from "./scalable-content/scalable-content.component";
import { ScalablePricesComponent } from "./scalable-prices/scalable-prices.component";
import { SearchComponent } from "./search/search.component";
import { SearchProductsComponent } from "./search-products/search-products.component";
import { SectionInfoComponent } from "./section-info/section-info.component";
import { SectionInvoicesComponent } from "./section-invoices/section-invoices.component";
import { SectionLoadingComponent } from "./section-loading/section-loading.component";
import { SeeMoreBrandsComponent } from "./see-more-brands/see-more-brands.component";
import { StarComponent } from "./star/star.component";
import { StepperComponent } from "./stepper/stepper.component";
import { SuggestedOrderComponent } from "./suggested-order/suggested-order.component";
import { SuggestedProductComponent } from "./suggested-product/suggested-product.component";
import { TermsComponent } from "./modals/terms/terms.component";
import { CreditLimitContentComponent } from "./credit-limit-content/credit-limit-content.component";
import { HeaderOrbittaClubComponent } from "./header-orbitta-club/header-orbitta-club.component";
import { ContentOrbittaClubComponent } from "./content-orbitta-club/content-orbitta-club.component";
import { BannerComponent } from "./banner/banner.component";
import { CategoriesSlideComponent } from "./categories-slide/categories-slide.component";
import { BaseChartDirective } from "ng2-charts";
import { FloatCartPpComponent } from "./float-cart-pp/float-cart-pp.component";
import { OrderDetailsPpComponent } from "./modals/order-details-pp/order-details-pp.component";
import { OrderSummaryPointsComponent } from "./order-summary-points/order-summary-points.component";
import { HeaderContentComponent } from "./header-content/header-content.component";

const components = [
  FloatCartPpComponent,
  EmptyMessageComponent,
  BackgroundImagePreLoaderDirective,
  PlusMinusComponent,
  ImagePreLoaderDirective,
  BgImageComponent,
  HeaderComponent,
  LoaderComponent,
  ProductsComponent,
  SuggestedOrderComponent,
  RebuyComponent,
  SearchComponent,
  NotificationCartAliveComponent,
  CreditLimitContentComponent,
  SeeMoreBrandsComponent,
  FooterCartComponent,
  CardUserComponent,
  SearchProductsComponent,
  SuggestedProductComponent,
  StepperComponent,
  ScalableContentComponent,
  MenuItemsComponent,
  ItemInfoComponent,
  SectionInfoComponent,
  SectionInvoicesComponent,
  CategoryItemComponent,
  LoanDetailComponent,
  OrderSummaryComponent,
  OrderSummaryPointsComponent,
  PaymentMethodsComponent,
  ScalablePricesComponent,
  ProductDetailHeaderComponent,
  LoadingComponent,
  LoadingMessageComponent,
  SectionLoadingComponent,
  ContainerWebComponent,
  HeaderWebComponent,
  MenuContentComponent,
  CartContentComponent,
  NotificationContentComponent,
  ProductDefaultComponent,
  FilterProductsContentComponent,
  ContainerWithMenuComponent,
  HeaderOrbittaClubComponent,
  ContentOrbittaClubComponent,
  BannerComponent,
  CategoriesSlideComponent,
  HeaderContentComponent,
  FilterProductsComponent, //Modal
  AlertComponent, //Modal
  BaseModalComponent, //Modal
  CardCreateComponent, //Modal
  CardSelectComponent, //Modal
  PixComponent, //Modal
  StarComponent, //Modal
  RatingComponent, //Modal
  ReturnableComponent, //Modal
  ScalableComponent, //Modal
  TermsComponent, //Modal
  OrderDetailsPpComponent, //Modal
];

const modules = [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, MaskitoModule, PipesModule, BaseChartDirective];

@NgModule({
  declarations: components,
  imports: modules,
  exports: [...components, ...modules],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
