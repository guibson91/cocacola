import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CatalogBrandsPage } from "./catalog-brands.page";

describe("CatalogBrandsPage", () => {
  let component: CatalogBrandsPage;
  let fixture: ComponentFixture<CatalogBrandsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CatalogBrandsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
