import { BaseComponent } from "../../base/base.component";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { User } from "src/app/models/user";

@Component({
  selector: "app-company-name",
  templateUrl: "./company-name.component.html",
  styleUrls: ["./company-name.component.scss"],
})
export class CompanyNameComponent extends BaseComponent implements OnInit {
  @Output() next = new EventEmitter();

  form = this.fb.group({
    name: ["", [Validators.required]],
  });

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

  nextClick() {
    const companyName = this.form.value.name;
    if (companyName) {
      const client: User = {
        company: {
          name: String(companyName),
        },
      };
      this.register.client = client;
      this.next.emit();
    } else {
      this.system.showErrorAlert(new Error("Razão social não pode ser vazio"));
      console.error("Razão social não pode ser vazio");
    }
  }
}
