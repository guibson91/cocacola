import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CatalogProductDetailPage } from "./catalog-product-detail.page";

describe("CatalogProductDetailPage", () => {
  let component: CatalogProductDetailPage;
  let fixture: ComponentFixture<CatalogProductDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CatalogProductDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
