import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { OrderSummaryPointsComponent } from "./order-summary-points.component";

describe("OrderSummaryPointsComponent", () => {
  let component: OrderSummaryPointsComponent;
  let fixture: ComponentFixture<OrderSummaryPointsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSummaryPointsComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSummaryPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
