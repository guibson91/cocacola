import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SHIFTS, WEEK_DAYS } from "src/app/models/business";
import { BaseComponent } from "../../base/base.component";
import { User } from "src/app/models/user";

@Component({
  selector: "app-logistics",
  templateUrl: "./logistics.component.html",
  styleUrls: ["./logistics.component.scss"],
})
export class LogisticsComponent extends BaseComponent implements OnInit {
  @Output() next = new EventEmitter();

  days = WEEK_DAYS;
  shifts = SHIFTS;

  openingStatus?: "open" | "openingSoon" | "openingLater" = "openingSoon";

  //Antigo atendimento: 'presencial' | 'digital';
  attendanceMode?: "in-person" | "digital" = "in-person";

  showErrors = false;

  constructor() {
    super();
  }

  ngOnInit() {
    this.register.clientChanged$.subscribe((client) => {
      if (client && client.logistic) {
        this.attendanceMode = client.logistic.attendanceMode ? client.logistic.attendanceMode : "in-person";
        this.openingStatus = client.logistic.openingStatus ? client.logistic.openingStatus : "openingSoon";
        if (client.logistic.availableDays) {
          this.days = WEEK_DAYS.map((day) => {
            if (client.logistic?.availableDays?.includes(day.day)) {
              day.checked = true;
            } else {
              day.checked = false;
            }
            return day;
          });
        }
        if (client.logistic.availableShifts) {
          this.shifts = SHIFTS.map((shift) => {
            if (client.logistic?.availableShifts?.includes(shift.shift)) {
              shift.checked = true;
            } else {
              shift.checked = false;
            }
            return shift;
          });
        }
      } else {
        this.openingStatus = "openingSoon";
        this.attendanceMode = "in-person";
        this.ref.detectChanges();
      }
    });
  }

  get hasDayChecked() {
    const foundDay = this.days.find((d) => d.checked);
    return foundDay ? true : false;
  }

  get hasShiftChecked() {
    const foundShift = this.shifts.find((s) => s.checked);
    return foundShift ? true : false;
  }

  async nextClick() {
    const selectedDays = this.days.filter((d) => d.checked);
    const selectedHours = this.shifts.filter((s) => s.checked);

    if (!this.attendanceMode) {
      this.showErrors = true;
    } else if (!this.register.isClientDb && (!selectedDays || selectedDays.length === 0)) {
      this.showErrors = true;
    } else if (!this.register.isClientDb && (!selectedHours || selectedHours.length === 0)) {
      this.showErrors = true;
    } else if (!this.register.isClientDb && !this.openingStatus) {
      this.showErrors = true;
    } else {
      this.showErrors = false;
      const client: User = {};
      client.logistic = {};
      client.logistic.attendanceMode = this.attendanceMode;
      if (this.openingStatus) {
        client.logistic.openingStatus = this.openingStatus;
      }
      if (selectedDays) {
        client.logistic.availableDays = selectedDays.map((d) => d.day);
      }
      if (selectedHours) {
        client.logistic.availableShifts = selectedHours.map((h) => h.shift);
      }
      this.register.client = client;
      this.next.emit();
    }
  }

  get disabled() {
    const selectedDays = this.days.filter((d) => d.checked);
    const selectedHours = this.shifts.filter((s) => s.checked);
    if (!this.attendanceMode) {
      return true;
    } else if (!this.register.isClientDb && (!selectedDays || selectedDays.length === 0)) {
      return true;
    } else if (!this.register.isClientDb && (!selectedHours || selectedHours.length === 0)) {
      return true;
    } else if (!this.register.isClientDb && !this.openingStatus) {
      return true;
    }
    return false;
  }
}
