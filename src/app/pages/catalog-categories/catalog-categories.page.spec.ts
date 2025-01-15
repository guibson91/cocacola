import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CatalogCategoriesPage } from "./catalog-categories.page";

describe("CatalogCategoriesPage", () => {
  let component: CatalogCategoriesPage;
  let fixture: ComponentFixture<CatalogCategoriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CatalogCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
