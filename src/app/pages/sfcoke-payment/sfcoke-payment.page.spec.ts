import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SfcokePaymentPage } from "./sfcoke-payment.page";

describe("SfcokePaymentPage", () => {
  let component: SfcokePaymentPage;
  let fixture: ComponentFixture<SfcokePaymentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SfcokePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
