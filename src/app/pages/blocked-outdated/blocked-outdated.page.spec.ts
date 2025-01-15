import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlockedOutdatedPage } from "./blocked-outdated.page";

describe("BlockedOutdatedPage", () => {
  let component: BlockedOutdatedPage;
  let fixture: ComponentFixture<BlockedOutdatedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BlockedOutdatedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
