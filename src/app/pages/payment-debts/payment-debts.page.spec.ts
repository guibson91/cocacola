import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaymentDebtsPage } from "./payment-debts.page";

describe("PaymentDebtsPage", () => {
  let component: PaymentDebtsPage;
  let fixture: ComponentFixture<PaymentDebtsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentDebtsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
