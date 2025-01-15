import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoanedAssetPage } from "./loaned-asset.page";

describe("LoanedAssetPage", () => {
  let component: LoanedAssetPage;
  let fixture: ComponentFixture<LoanedAssetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoanedAssetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
