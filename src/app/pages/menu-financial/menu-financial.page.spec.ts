import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MenuFinancialPage } from "./menu-financial.page";

describe("MenuFinancialPage", () => {
  let component: MenuFinancialPage;
  let fixture: ComponentFixture<MenuFinancialPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MenuFinancialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
