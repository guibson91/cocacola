import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoanHistoricPage } from "./loan-historic.page";

describe("LoanHistoricPage", () => {
  let component: LoanHistoricPage;
  let fixture: ComponentFixture<LoanHistoricPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoanHistoricPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
