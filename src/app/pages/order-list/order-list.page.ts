import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "src/app/components/components.module";
import { BaseComponent } from "src/app/components/base/base.component";
import { Order } from "src/app/models/order";
import { Subscription, tap } from "rxjs";
import { OrderDetailsPpComponent } from "@app/components/modals/order-details-pp/order-details-pp.component";

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.page.html",
  styleUrls: ["./order-list.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule],
})
export class OrderListPage extends BaseComponent implements OnInit {
  allOrders: Order[];

  //Pedidos em aberto
  currentOrders?: Order[];
  filteredCurrentOrders?: Order[];

  //Pedidos encerrados (cancelado, concluído, corte total)
  finishedOrders?: Order[];
  filteredFinishedOrders?: Order[];

  isPP = false;

  private subscriptions: Subscription = new Subscription();

  emptyFishedMessage;
  emptyInProgressMessage;
  loadingFinishedMessage;
  loadingInProgressMessage;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.isPP = this.handleIsPP();
    this.emptyFishedMessage = this.isPP ? "Você não possui resgates finalizados." : "Você não possui pedidos finalizados.";
    this.emptyInProgressMessage = this.isPP ? "Você não possui resgates em andamento." : "Você não possui pedidos em andamento.";
    this.loadingFinishedMessage = this.isPP ? "Carregando resgates finalizados..." : "Carregando pedidos finalizados...";
    this.loadingInProgressMessage = this.isPP ? "Carregando resgates em andamento..." : "Carregando pedidos em andamento...";
    this.subscriptions.add(
      this.cart.updateOrders$.subscribe(() => {
        this.loadOrders().subscribe();
      }),
    );
  }

  ionViewWillEnter() {
    this.loadOrders().subscribe();
  }

  handleRefresh(event) {
    this.loadOrders().subscribe(() => {
      event.target.complete();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadOrders() {
    // this.currentOrders = undefined;
    // this.finishedOrders = undefined;
    return this.shared.get<Order[]>(this.isPP ? "checkout/orders?is_redeem=1" : "checkout/orders").pipe(
      tap((res) => {
        if (res.status && res.data) {
          this.allOrders = res.data;
          this.currentOrders = res.data.filter((o) => o.status !== "delivered" && o.status !== "returned" && !o.canceled);
          this.filteredCurrentOrders = this.currentOrders;

          this.finishedOrders = res.data.filter((o) => o.status === "delivered" || o.status === "returned" || o.canceled);
          this.filteredFinishedOrders = this.finishedOrders;
        } else {
          this.currentOrders = [];
          this.finishedOrders = [];
          this.system.showErrorAlert(res);
        }
      }),
    );
  }

  async openOrderDetail(order) {
    if (this.isPP) {
      const modal = await this.system.modalCtrl.create({
        component: OrderDetailsPpComponent,
        backdropDismiss: false,
        cssClass: "terms",
        componentProps: {
          order: order,
        },
      });
      modal.present();
    } else {
      this.openPage([`tabs/orders/${order.order}`]);
    }
  }

  filterList(data: any[]) {
    if (data && data.length > 0) {
      this.filteredCurrentOrders = data.filter((o) => o.status !== "delivered");
      this.filteredFinishedOrders = data.filter((o) => o.status === "delivered");
    } else {
      this.filteredFinishedOrders = [];
      this.filteredCurrentOrders = [];
    }
  }
}
