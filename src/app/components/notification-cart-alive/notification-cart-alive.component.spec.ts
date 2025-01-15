import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { NotificationCartAliveComponent } from "./notification-cart-alive.component";

describe("NotificationCartAliveComponent", () => {
  let component: NotificationCartAliveComponent;
  let fixture: ComponentFixture<NotificationCartAliveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationCartAliveComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCartAliveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
