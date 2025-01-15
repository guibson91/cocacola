import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MenuAlertsPage } from "./menu-alerts.page";

describe("MenuAlertsPage", () => {
  let component: MenuAlertsPage;
  let fixture: ComponentFixture<MenuAlertsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MenuAlertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
