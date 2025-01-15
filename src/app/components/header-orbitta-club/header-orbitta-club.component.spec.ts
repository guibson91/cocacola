import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { HeaderOrbittaClubComponent } from "./header-orbitta-club.component";

describe("HeaderOrbittaClubComponent", () => {
  let component: HeaderOrbittaClubComponent;
  let fixture: ComponentFixture<HeaderOrbittaClubComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderOrbittaClubComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderOrbittaClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
