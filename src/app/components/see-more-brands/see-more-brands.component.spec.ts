import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SeeMoreBrandsComponent } from "./see-more-brands.component";

describe("SeeMoreBrandsComponent", () => {
  let component: SeeMoreBrandsComponent;
  let fixture: ComponentFixture<SeeMoreBrandsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SeeMoreBrandsComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SeeMoreBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
