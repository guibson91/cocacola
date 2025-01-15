import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CatalogProductsPage } from "./catalog-products.page";

describe("CatalogProductsPage", () => {
  let component: CatalogProductsPage;
  let fixture: ComponentFixture<CatalogProductsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CatalogProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
