import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { ContentOrbittaClubComponent } from "./content-orbitta-club.component";

describe("ContentOrbittaClubComponent", () => {
  let component: ContentOrbittaClubComponent;
  let fixture: ComponentFixture<ContentOrbittaClubComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentOrbittaClubComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentOrbittaClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
