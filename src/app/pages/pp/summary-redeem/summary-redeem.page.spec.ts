import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SummaryRedeemPage } from "./summary-redeem.page";

describe("SummaryRedeemPage", () => {
  let component: SummaryRedeemPage;
  let fixture: ComponentFixture<SummaryRedeemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SummaryRedeemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
