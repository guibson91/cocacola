import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MenuConfigPage } from "./menu-config.page";

describe("MenuConfigPage", () => {
  let component: MenuConfigPage;
  let fixture: ComponentFixture<MenuConfigPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MenuConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
