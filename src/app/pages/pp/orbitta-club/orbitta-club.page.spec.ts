import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrbittaClubPage } from "./orbitta-club.page";

describe("OrbittaClubPage", () => {
  let component: OrbittaClubPage;
  let fixture: ComponentFixture<OrbittaClubPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrbittaClubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
