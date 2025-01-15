import { BaseComponent } from "src/app/components/base/base.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { Extract } from "src/app/models/extract";
import { FormBuilder, FormsModule, Validators } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MaskitoElementPredicateAsync, MaskitoOptions } from "@maskito/core";
import { Pagination } from "src/app/models/pagination";
import { patternFullDateMask } from "src/app/util/masks";
import { periodValidator } from "src/app/util/validators";

type PeriodType = 15 | 30 | 60 | 90 | 120;

@Component({
  selector: "app-extract",
  templateUrl: "./extract.page.html",
  styleUrls: ["./extract.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class ExtractPage extends BaseComponent implements OnInit {
  periodRange: PeriodType[] = [15, 30, 60, 90, 120];

  today = new Date();

  selectedPeriod: PeriodType = 15;

  form = this.fb.group({
    fromDate: ["", [Validators.required, periodValidator()]],
    toDate: ["", [Validators.required, periodValidator()]],
  });

  readonly fullDateMask: MaskitoOptions = patternFullDateMask;
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  extracts?: Extract[];

  page = 1;
  hasNext?: boolean;

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.shared.user$.subscribe((u) => {
      console.log("Usuário logado: ", u);
    });
    this.initDates();
  }

  initDates() {
    const today = new Date();
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(today.getDate() - 15);
    const formattedToday = this.formatDate(today);
    const formattedFifteenDaysAgo = this.formatDate(fifteenDaysAgo);
    this.form.patchValue({
      fromDate: [formattedFifteenDaysAgo],
      toDate: [formattedToday],
    });
    this.loadExtract(fifteenDaysAgo.toISOString(), today.toISOString());
  }

  loadExtract(dateStart?: string, dateEnd?: string, event?) {
    let query = `?page=${this.page}`;
    if (dateStart && dateEnd) {
      query += `&dateStart=${dateStart}&dateEnd=${dateEnd}`;
    }
    this.shared.get<{ items: Extract[]; pagination: Pagination }>(`engine/earn/point/customer/history/balance${query}`).subscribe((res) => {
      if (event) {
        event.target.complete();
      }
      if (res && res.data && res.data.pagination) {
        this.hasNext = res.data.pagination.next >= 1 ? true : false;
      }
      if (res && res.data && res.data.items) {
        const currentExtract = this.extracts ? this.extracts : [];
        this.extracts = this.page > 1 ? [...currentExtract, ...res.data.items] : res.data.items;
      } else {
        if (this.page === 1) this.extracts = [];
      }
    });
  }

  loadMore(event?: any) {
    this.page++;
    const dateStart = this.form.value.fromDate ? this.convertDateFormat(String(this.form.value.fromDate)) : undefined;
    const dateEnd = this.form.value.toDate ? this.convertDateFormat(String(this.form.value.toDate)) : undefined;
    if (dateStart && dateEnd) {
      this.loadExtract(new Date(dateStart).toISOString(), new Date(dateEnd).toISOString(), event);
    }
  }

  choosePeriod(day: PeriodType) {
    this.selectedPeriod = day;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - day);
    const endDate = new Date();
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    this.form.reset();
    this.form.patchValue({
      fromDate: [formattedStartDate],
      toDate: [formattedEndDate],
    });
    this.page = 1;
    this.extracts = undefined;
    this.loadExtract(startDate.toISOString(), endDate.toISOString());
  }

  formatDate(date: Date): string {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  filterDates() {
    this.page = 1;
    const dateStart = this.form.value.fromDate ? this.convertDateFormat(String(this.form.value.fromDate)) : undefined;
    const dateEnd = this.form.value.toDate ? this.convertDateFormat(String(this.form.value.toDate)) : undefined;
    if (!dateStart || !dateEnd) {
      console.error("Datas de início e fim são necessárias para filtrar.");
      return;
    }
    this.extracts = undefined;
    this.loadExtract(dateStart, dateEnd);
  }

  convertDateFormat(dateStr: string): string {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  changeDate() {
    const initDate = this.form.value.fromDate;
    const finalDate = this.form.value.toDate;
    if (initDate && finalDate) {
      this.filterDates();
    }
  }
}
