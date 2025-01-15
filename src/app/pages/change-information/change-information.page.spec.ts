import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChangeInformationPage } from "./change-information.page";

describe("ChangeInformationPage", () => {
  let component: ChangeInformationPage;
  let fixture: ComponentFixture<ChangeInformationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChangeInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
