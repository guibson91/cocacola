import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CreditLimitPage } from "./credit-limit.page";

describe("CreditLimitPage", () => {
  let component: CreditLimitPage;
  let fixture: ComponentFixture<CreditLimitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreditLimitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
