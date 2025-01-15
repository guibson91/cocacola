import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CartSummaryPage } from "./cart-summary.page";

describe("CartSummaryPage", () => {
  let component: CartSummaryPage;
  let fixture: ComponentFixture<CartSummaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CartSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
