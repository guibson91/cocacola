import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ExtractPage } from "./extract.page";

describe("ExtractPage", () => {
  let component: ExtractPage;
  let fixture: ComponentFixture<ExtractPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExtractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
