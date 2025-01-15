import { BaseComponent } from "../../base/base.component";
import { cellphoneValidator } from "src/app/util/validators";
import { User } from "src/app/models/user";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { patternPhoneMask } from "src/app/util/masks";
import { removeSymbol } from "src/app/util/util";
import { TermsComponent } from "../../modals/terms/terms.component";

@Component({
  selector: "app-contact-info",
  templateUrl: "./contact-info.component.html",
  styleUrls: ["./contact-info.component.scss"],
})
export class ContactInfoComponent extends BaseComponent implements OnInit {
  @Output() next = new EventEmitter();

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    cellphone: ["", [Validators.required]],
    comercialPhone: [""],
  });

  readonly phoneMask: MaskitoOptions = patternPhoneMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  checkTerms = false;

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.register.clientChanged$.subscribe((client) => {
      if (client && client.responsible) {
        this.form.patchValue(client.responsible);
      } else {
        this.form.reset();
      }
    });
  }

  nextClick() {
    let { email, cellphone, comercialPhone } = this.form.value;
    if (!email) {
      this.system.showErrorAlert(new Error("E-mail não pode ser vazio"));
    }
    if (!cellphone) {
      this.system.showErrorAlert(new Error("Seu número de celular não pode ser vazio"));
    }
    cellphone = removeSymbol(cellphone ?? "");
    comercialPhone = removeSymbol(comercialPhone ?? "");
    const client: User = {
      responsible: {
        email: email as string,
        cellphone: cellphone as string,
        comercialPhone: comercialPhone ? comercialPhone : "",
      },
    };
    this.register.client = client;
    this.next.emit();
  }

  openTerms() {
    this.openTermsPrivacy("terms");
  }

  openPrivacy() {
    this.openTermsPrivacy("privacy");
  }

  async openTermsPrivacy(type: "terms" | "privacy") {
    const modal = await this.system.modalCtrl.create({
      component: TermsComponent,
      backdropDismiss: false,
      cssClass: "terms",
      componentProps: {
        type,
      },
    });
    modal.present();
  }
}
