import { BaseComponent } from "src/app/components/base/base.component";
import { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { CreditLimit } from "src/app/models/balance";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Menu, menuBusiness } from "src/app/models/menu";
import { StatusBar } from "@capacitor/status-bar";
import { User } from "src/app/models/user";
import { YearlyData } from "@app/models/revenue";
import { addMonths, format } from "date-fns";

@Component({
  selector: "app-business",
  templateUrl: "./business.page.html",
  styleUrls: ["./business.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class BusinessPage extends BaseComponent implements OnInit, OnDestroy {
  chartData: ChartData<"bar">;
  chartOptions: ChartOptions<"bar">;

  menu: Menu[] = menuBusiness;
  creditLimit: CreditLimit;
  user: User;

  data: YearlyData;

  hasContent = false;

  constructor() {
    super();
  }

  buildChartData(): ChartData<"bar"> {
    const currentYearData: number[] = [];
    const lastYearData: number[] = [];

    // Mapeamento dos meses em inglês para português
    const monthMap: { [key: string]: string } = {
      Jan: "Jan",
      Feb: "Fev",
      Mar: "Mar",
      Apr: "Abr",
      May: "Mai",
      Jun: "Jun",
      Jul: "Jul",
      Aug: "Ago",
      Sep: "Set",
      Oct: "Out",
      Nov: "Nov",
      Dec: "Dez",
    };

    // Obter a data atual e calcular os últimos 6 meses, incluindo o mês atual
    const currentDate = new Date();
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => format(addMonths(currentDate, -i), "MMM")).reverse();

    this.hasContent = false;

    // Iterar sobre os últimos 6 meses e buscar os dados correspondentes
    for (const month of lastSixMonths) {
      // Procurar o mês no ano atual
      const currentMonthData = this.data.currentYear?.find((m) => m.month === month);
      if (currentMonthData && currentMonthData.total) {
        currentYearData.push(currentMonthData.total / 100);
        this.hasContent = true;
      } else {
        currentYearData.push(0);
      }

      // Procurar o mês no ano anterior
      const lastMonthData = this.data.lastYear?.find((m) => m.month === month);
      if (lastMonthData && lastMonthData.total) {
        lastYearData.push(lastMonthData.total / 100);
        this.hasContent = true;
      } else {
        lastYearData.push(0);
      }
    }

    // Traduzir os labels dos meses para português
    const labels = lastSixMonths.map((month) => monthMap[month]);

    // Atualizar o título para refletir o intervalo correto dos meses
    const startMonth = labels[0];
    const endMonth = labels[labels.length - 1];
    this.data.title = `${startMonth} - ${endMonth} ${this.data.year}`;

    // Retornar a configuração do gráfico com os dados dos últimos 6 meses
    return {
      labels: labels,
      datasets: [
        {
          label: `${Number(this.data.year) - 1} - R$${lastYearData.reduce((acc, val) => acc + val, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          data: lastYearData,
          backgroundColor: "#cfcfcf", //cinza
          borderColor: "#cfcfcf",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: `${this.data.year} - R$${currentYearData.reduce((acc, val) => acc + val, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          data: currentYearData,
          backgroundColor: "#028b2a", //verde
          borderColor: "#028b2a",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }

  buildChartOptions(): ChartOptions<"bar"> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      scales: {
        x: {},
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: false,
            pointStyle: "react",
            boxWidth: 10,
            boxHeight: 10,
            padding: 10,
            borderRadius: 2,
            useBorderRadius: true,
            font: {
              size: 12,
              weight: "bold",
              lineHeight: 1.2,
            },
          },
          align: "start",
          fullSize: false,
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: TooltipItem<"bar">) => {
              // Mostrar apenas o valor do faturamento do mês
              const value = tooltipItem.raw as number;
              return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
            },
          },
        },
      },
    };
  }

  ngOnInit() {
    this.changeStatusBar("primary");
    if (this.shared.platform.is("capacitor")) {
      this.setBackgroundStatusBar("#f40000");
    }
    this.shared.user$.subscribe((u) => {
      if (u) {
        this.user = u;
        this.loadRevenue();
      }
    });
  }

  loadRevenue() {
    this.shared.get("user/revenue/year").subscribe((res) => {
      if (res && res.data) {
        this.data = res.data;
        this.chartData = this.buildChartData();
        this.chartOptions = this.buildChartOptions();
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.shared.platform.is("capacitor")) {
      this.setBackgroundStatusBar("#efefef");
    }
  }

  async setBackgroundStatusBar(color) {
    await StatusBar.setBackgroundColor({ color: color });
  }

  async initCreditLimit() {
    const loading = await this.system.loadingCtrl.create({});
    loading.present();
    this.shared.get<CreditLimit>(`user/credit-limit`).subscribe((res) => {
      loading.dismiss();
      if (res && res.data) {
        const creditLimit = res.data;
        creditLimit.visitDate = new Date(creditLimit.visitDate);
        creditLimit.salesVisitDate = new Date(creditLimit.salesVisitDate);
        creditLimit.salesPlannerVisitDate = new Date(creditLimit.salesPlannerVisitDate);
        this.creditLimit = creditLimit;
      } else {
        this.system.showErrorAlert(res);
      }
    });
  }
}
