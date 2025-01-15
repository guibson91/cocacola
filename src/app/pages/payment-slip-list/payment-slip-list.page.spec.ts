import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaymentSlipListPage } from "./payment-slip-list.page";

describe("PaymentSlipListPage", () => {
  let component: PaymentSlipListPage;
  let fixture: ComponentFixture<PaymentSlipListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentSlipListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
