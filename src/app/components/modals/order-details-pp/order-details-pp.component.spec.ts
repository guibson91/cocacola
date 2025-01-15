import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { OrderDetailsPpComponent } from "./order-details-pp.component";

describe("ProductDetailsPpComponent", () => {
  let component: OrderDetailsPpComponent;
  let fixture: ComponentFixture<OrderDetailsPpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDetailsPpComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsPpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
