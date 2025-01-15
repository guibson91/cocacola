import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaymentSlipDetailPage } from "./payment-slip-detail.page";

describe("PaymentSlipDetailPage", () => {
  let component: PaymentSlipDetailPage;
  let fixture: ComponentFixture<PaymentSlipDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentSlipDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
