import { Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { AuthGuard } from "../guards/auth.guard";

export const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadComponent: () => import("./../pages/home/home.page").then((m) => m.HomePage),
        canActivate: [AuthGuard],
      },
      {
        path: "catalog",
        children: [
          {
            path: "",
            loadComponent: () => import("./../pages/catalog-categories/catalog-categories.page").then((m) => m.CatalogCategoriesPage),
            canActivate: [AuthGuard],
          },
          {
            path: "brands",
            loadComponent: () => import("./../pages/catalog-brands/catalog-brands.page").then((m) => m.CatalogBrandsPage),
            canActivate: [AuthGuard],
          },
          {
            path: "products",
            children: [
              {
                path: "",
                loadComponent: () => import("./../pages/catalog-products/catalog-products.page").then((m) => m.CatalogProductsPage),
                canActivate: [AuthGuard],
              },
              {
                path: "details",
                loadComponent: () => import("./../pages/catalog-product-detail/catalog-product-detail.page").then((m) => m.CatalogProductDetailPage),
                canActivate: [AuthGuard],
              },
            ],
          },
        ],
      },
      {
        path: "cart",
        children: [
          {
            path: "",
            loadComponent: () => import("./../pages/cart/cart.page").then((m) => m.CartPage),
            canActivate: [AuthGuard],
          },
          {
            path: "payment",
            children: [
              {
                path: "",
                loadComponent: () => import("./../pages/cart-payment/cart-payment.page").then((m) => m.CartPaymentPage),
                canActivate: [AuthGuard],
              },
              {
                path: "summary",
                loadComponent: () => import("./../pages/cart-summary/cart-summary.page").then((m) => m.CartSummaryPage),
                canActivate: [AuthGuard],
              },
            ],
          },
        ],
      },
      {
        path: "pp",
        children: [
          {
            path: "",
            loadComponent: () => import("./../pages/pp/orbitta-club/orbitta-club.page").then((m) => m.OrbittaClubPage),
            canActivate: [AuthGuard],
          },
          {
            path: "rules",
            loadComponent: () => import("./../pages/pp/rules/rules.page").then((m) => m.RulesPage),
            canActivate: [AuthGuard],
          },
          {
            path: "extract",
            loadComponent: () => import("./../pages/pp/extract/extract.page").then((m) => m.ExtractPage),
            canActivate: [AuthGuard],
          },
          {
            path: "orbitta-categories",
            loadComponent: () => import("./../pages/pp/orbitta-categories/orbitta-categories.page").then((m) => m.OrbittaCategoriesPage),
            canActivate: [AuthGuard],
          },
          {
            path: "orders",
            children: [
              {
                path: "",
                loadComponent: () => import("./../pages/order-list/order-list.page").then((m) => m.OrderListPage),
                canActivate: [AuthGuard],
              },
              {
                path: ":id",
                loadComponent: () => import("./../pages/order-detail/order-detail.page").then((m) => m.OrderDetailPage),
                canActivate: [AuthGuard],
              },
            ],
          },
          {
            path: "catalog",
            children: [
              {
                path: "",
                loadComponent: () => import("./../pages/catalog-categories/catalog-categories.page").then((m) => m.CatalogCategoriesPage),
                canActivate: [AuthGuard],
              },
              {
                path: "brands",
                loadComponent: () => import("./../pages/catalog-brands/catalog-brands.page").then((m) => m.CatalogBrandsPage),
                canActivate: [AuthGuard],
              },
              {
                path: "products",
                children: [
                  {
                    path: "",
                    loadComponent: () => import("./../pages/catalog-products/catalog-products.page").then((m) => m.CatalogProductsPage),
                    canActivate: [AuthGuard],
                  },
                  {
                    path: "details",
                    loadComponent: () => import("./../pages/catalog-product-detail/catalog-product-detail.page").then((m) => m.CatalogProductDetailPage),
                    canActivate: [AuthGuard],
                  },
                ],
              },
            ],
          },
          {
            path: "cart-redeem",
            children: [
              {
                path: "",
                loadComponent: () => import("./../pages/pp/cart-redeem/cart-redeem.page").then((m) => m.CartRedeemPage),
                canActivate: [AuthGuard],
              },
              {
                path: "summary",
                loadComponent: () => import("./../pages/pp/summary-redeem/summary-redeem.page").then((m) => m.SummaryRedeemPage),
                canActivate: [AuthGuard],
              },
            ],
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            path: "",
            loadComponent: () => import("./../pages/order-list/order-list.page").then((m) => m.OrderListPage),
            canActivate: [AuthGuard],
          },
          {
            path: ":id",
            loadComponent: () => import("./../pages/order-detail/order-detail.page").then((m) => m.OrderDetailPage),
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: "menu",
        children: [
          {
            path: "",
            loadComponent: () => import("./../pages/menu/menu.page").then((m) => m.MenuPage),
            canActivate: [AuthGuard],
          },
          {
            path: "loaned-asset",
            loadComponent: () => import("./../pages/loaned-asset/loaned-asset.page").then((m) => m.LoanedAssetPage),
            canActivate: [AuthGuard],
          },
          {
            path: "financial",
            loadComponent: () => import("./../pages/menu-financial/menu-financial.page").then((m) => m.MenuFinancialPage),
            canActivate: [AuthGuard],
          },
          {
            path: "business",
            loadComponent: () => import("./../pages/business/business.page").then((m) => m.BusinessPage),
            canActivate: [AuthGuard],
          },
          {
            path: "config",
            loadComponent: () => import("../pages/menu-config/menu-config.page").then((m) => m.MenuConfigPage),
            canActivate: [AuthGuard],
          },
          {
            path: "cards",
            loadComponent: () => import("../pages/card-list/card-list.page").then((m) => m.CardListPage),
            canActivate: [AuthGuard],
          },
          {
            path: "alerts",
            loadComponent: () => import("./../pages/menu-alerts/menu-alerts.page").then((m) => m.MenuAlertsPage),
            canActivate: [AuthGuard],
          },
          {
            path: "credit-limit",
            loadComponent: () => import("./../pages/credit-limit/credit-limit.page").then((m) => m.CreditLimitPage),
            canActivate: [AuthGuard],
          },
          {
            path: "payment-slip",
            children: [
              {
                path: "",
                loadComponent: () => import("./../pages/payment-slip-list/payment-slip-list.page").then((m) => m.PaymentSlipListPage),
                canActivate: [AuthGuard],
              },
              {
                path: ":id",
                loadComponent: () => import("./../pages/payment-slip-detail/payment-slip-detail.page").then((m) => m.PaymentSlipDetailPage),
                canActivate: [AuthGuard],
              },
            ],
          },
          {
            path: "loan-historic",
            loadComponent: () => import("./../pages/loan-historic/loan-historic.page").then((m) => m.LoanHistoricPage),
            canActivate: [AuthGuard],
          },
          {
            path: "payment-debts",
            loadComponent: () => import("./../pages/payment-debts/payment-debts.page").then((m) => m.PaymentDebtsPage),
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/home",
    pathMatch: "full",
  },
];
