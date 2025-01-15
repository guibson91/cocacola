import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrbittaCategoriesPage } from "./orbitta-categories.page";

describe("OrbittaCategoriesPage", () => {
  let component: OrbittaCategoriesPage;
  let fixture: ComponentFixture<OrbittaCategoriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrbittaCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
