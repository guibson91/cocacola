import { CommonModule } from "@angular/common";
import { CompanyComponent } from "./company/company.component";
import { CompanyNameComponent } from "./company-name/company-name.component";
import { ComponentsModule } from "../components.module";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { ContactBoxComponent } from "./contact-box/contact-box.component";
import { ContactInfoComponent } from "./contact-info/contact-info.component";
import { CpfCnpjComponent } from "./cpf-cnpj/cpf-cnpj.component";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { DocumentsComponent } from "./documents/documents.component";
import { HeaderFormComponent } from "./header-form/header-form.component";
import { IonicModule } from "@ionic/angular";
import { LogisticsComponent } from "./logistics/logistics.component";
import { PasswordComponent } from "./password/password.component";
import { PersonalInfoComponent } from "./personal-info/personal-info.component";
import { UploadFileComponent } from "./upload-file/upload-file.component";

@NgModule({
  declarations: [
    HeaderFormComponent,
    CompanyNameComponent,
    ConfirmationComponent,
    ContactBoxComponent,
    CpfCnpjComponent,
    PasswordComponent,
    CompanyComponent,
    LogisticsComponent,
    DocumentsComponent,
    UploadFileComponent,
    ContactInfoComponent,
    PersonalInfoComponent,
  ],
  imports: [IonicModule, CommonModule, ComponentsModule],
  exports: [
    HeaderFormComponent,
    CompanyNameComponent,
    ConfirmationComponent,
    ContactBoxComponent,
    CpfCnpjComponent,
    PasswordComponent,
    CompanyComponent,
    LogisticsComponent,
    DocumentsComponent,
    UploadFileComponent,
    ContactInfoComponent,
    PersonalInfoComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterModule {}
