import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CartRedeemPage } from "./cart-redeem.page";

describe("CartRedeemPage", () => {
  let component: CartRedeemPage;
  let fixture: ComponentFixture<CartRedeemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CartRedeemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
