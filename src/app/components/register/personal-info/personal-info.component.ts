import { BaseComponent } from "../../base/base.component";
import { birthdayValidator, cpfCnpjValidator } from "src/app/util/validators";
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { convertDateForServer, convertDateFromServer } from "src/app/util/date";
import { FormBuilder, Validators } from "@angular/forms";
import { IonDatetime } from "@ionic/angular";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { patternFullDateMask, patternCpfCnpjMask } from "src/app/util/masks";
import { removeSymbol } from "src/app/util/util";
import { User } from "src/app/models/user";

@Component({
  selector: "app-personal-info",
  templateUrl: "./personal-info.component.html",
  styleUrls: ["./personal-info.component.scss"],
})
export class PersonalInfoComponent extends BaseComponent implements OnInit {
  @ViewChild("datePicker", { static: false, read: IonDatetime }) datePicker: any;

  @Output() next = new EventEmitter();

  form = this.fb.group({
    cpfPartner: ["", [Validators.required, cpfCnpjValidator()]],
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
    birthday: ["", [Validators.required, birthdayValidator()]],
  });

  maxDate;

  readonly cpfCnpjMask: MaskitoOptions = patternCpfCnpjMask;
  readonly birthdayMask: MaskitoOptions = patternFullDateMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.initMaxDate();
    this.register.clientChanged$.subscribe((client) => {
      if (client && client.responsible) {
        this.form.patchValue({
          firstName: client.responsible.firstName ? client.responsible.firstName : "",
          lastName: client.responsible.lastName ? client.responsible.lastName : "",
          cpfPartner: client.responsible.cpfPartner ? (client.responsible.cpfPartner as any) : "",
          birthday: client.responsible.birthday ? (convertDateFromServer(client.responsible.birthday) as any) : "",
        });
      } else {
        this.form.reset();
      }
    });
  }

  ngOnDestroy() {
    this.register.clientChanged$.unsubscribe();
  }

  async nextClick() {
    if (this.form.invalid) {
      return;
    }
    const { cpfPartner, firstName, lastName, birthday } = this.form.value;
    const client: User = {
      responsible: {
        cpfPartner: removeSymbol(String(cpfPartner)),
        firstName: String(firstName),
        lastName: String(lastName),
        name: String(firstName) + " " + String(lastName),
        birthday: birthday ? convertDateForServer(birthday as any) : "",
      },
    };
    this.register.client = client;
    this.next.emit();
  }

  changeBirthday(ev: any) {
    this.form.patchValue({ birthday: ev.detail.value });
    this.ref;
  }

  initMaxDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    date.setDate(date.getDate() + 1); // Garante que se hoje for o aniversário de 18 anos, o usuário ainda não poderá se cadastrar
    this.maxDate = date.toISOString().split("T")[0]; // Apenas a data, sem a hora
  }

  openDatePicker() {
    const datetimeButton = document.querySelector("ion-datetime-button");

    if (!datetimeButton) {
      return;
    }
    const shadowRoot = datetimeButton.shadowRoot;

    if (!shadowRoot) {
      return;
    }
    const buttonInsideShadow = shadowRoot.querySelector("#date-button");

    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    if (buttonInsideShadow) {
      buttonInsideShadow.dispatchEvent(clickEvent);
    }
  }
}
