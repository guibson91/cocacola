import { BaseComponent } from "../../base/base.component";
import { Business, businesses, BusinessKey, industries, KEYS } from "src/app/models/business";
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { getAddressByCep } from "src/app/util/cep";
import { IonAccordionGroup } from "@ionic/angular";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { patternCepMask } from "src/app/util/masks";
import { removeSymbol } from "src/app/util/util";
import { User } from "src/app/models/user";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"],
})
export class CompanyComponent extends BaseComponent implements OnInit {
  @ViewChild("accordionGroup", { static: true })
  accordionGroup: IonAccordionGroup;

  @Output() next = new EventEmitter();

  industryTypes: string[] = industries;
  businessTypes: Business[];
  keys: BusinessKey[] = KEYS;

  businessSelected;
  industrySelected;

  form: FormGroup = this.fb.group({
    cnpj: [""],
    tradingName: ["", [Validators.required]],
    businessKey: ["", [Validators.required]],
    address: this.fb.group({
      postalCode: ["", [Validators.required, Validators.minLength(10)]],
      street: ["", [Validators.required]],
      neighborhood: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      streetNumber: ["", [Validators.required]],
      complement: [""],
      reference: [""],
    }),
  });

  errorCep = false;

  notNumber = false;

  readonly cepMask: MaskitoOptions = patternCepMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.register.clientChanged$.subscribe((client) => {
      if (client && client.company) {
        this.form.patchValue(client.company);
      } else {
        this.form.reset();
      }
    });
  }

  changeNotNumber() {
    const streetNumberControl = this.form.get("address.streetNumber");
    if (this.notNumber && streetNumberControl) {
      streetNumberControl.clearValidators(); // Removendo todos os validadores
    } else if (streetNumberControl) {
      streetNumberControl.setValidators([Validators.required]);
    }
    if (streetNumberControl) {
      streetNumberControl.updateValueAndValidity(); // Recalculando a validade do controle
    }
  }

  async nextClick() {
    if (this.form.invalid) {
      return;
    }
    const company = this.form.value;
    if (company) {
      if (!company.name) {
        company.name = company.tradingName;
      }
      if (!company.cnpj) {
        company.cnpj = this.register.client.cpfCnpj;
      }
      const client: User = { company };

      this.register.client = client;
      const loading = await this.system.loadingCtrl.create({
        message: "Enviando informações",
      });
      loading.present();
      this.shared.post("register/company", this.register.client, undefined, undefined, true).subscribe((res) => {
        loading.dismiss();
        if (res.status) {
          this.next.emit();
        } else {
          this.system.showErrorAlert(new Error(res.message ? res.message : "Falha ao cadastrar dados de empresa"));
        }
      });
    }
  }

  selectIndustry(industryType) {
    this.industrySelected = industryType;
    this.businessSelected = null;
    this.businessTypes = businesses.filter((business) => business.industryType === industryType);

    this.toggleAccordion("industry");
  }

  selectBusiness(businessType) {
    this.businessSelected = businessType;

    this.updateKey();
    this.toggleAccordion("business");
  }

  toggleAccordion = (id: string) => {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === id) {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = id;
    }
  };

  accordionGroupChange(ev: any) {
    const selectedValue = ev.detail.value;

    if (selectedValue === "business" && !this.industrySelected) {
      this.system.showErrorAlert(new Error("Você deve primeiramente selecionar a área de atuação"));
    }
  }

  updateKey() {
    if (!this.businessSelected) {
      return;
    }
    const index = this.keys.findIndex((key) => {
      return key.description === this.businessSelected.id;
    });
    if (index < 0) {
      console.error("Ops!! Algo de errado aconeceu!!! Deveria ter encontrado o index");
      this.form.patchValue({ key: "" });
    }
    this.form.patchValue({ businessKey: this.keys[index].key });
  }

  handleCepChange(e) {
    let postalCode: string = e.target.value;
    postalCode = removeSymbol(postalCode);

    if (postalCode.length === 8) {
      getAddressByCep(postalCode).subscribe((res) => {
        if (res) {
          this.errorCep = false;
          this.form.patchValue({
            address: res,
          });
        } else {
          this.errorCep = true;
          this.form.patchValue({
            address: {
              city: "",
              state: "",
              street: "",
              neighborhood: "",
            },
          });
        }
      });
    } else {
      this.errorCep = true;
      this.form.patchValue({
        address: {
          city: "",
          state: "",
          street: "",
          neighborhood: "",
        },
      });
    }
  }
}
