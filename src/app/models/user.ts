import { Address } from "./address";

export type Status =
  | "active"
  | "blocked"
  | "review"
  | "canceled" //Status de Acesso
  | "db_client"
  | "db_client_created" //Status de cadastro [usuário na base do cliente]
  | "no_register"
  | "no_register_created"
  | "no_register_company"
  | "no_register_document"; //Status de cadastro [usuário sem estar na base do cliente]

//Client on Register Flow
export interface User {
  userStatus?: Status;
  cpfCnpj?: string;
  clientId?: string; //PV
  balanceAvailablePoints?: number;
  company?: {
    name?: string; //required if CNPJ / null if CPF
    tradingName?: string; //nome fantasia (nome do estabelecimento)
    address?: Address;
    businessKey?: string;
    cnpj?: string;
  };
  responsible?: {
    cpfPartner?: string;
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    email?: string;
    password?: string;
    cellphone?: string;
    comercialPhone?: string;
    defaultPaymentCondition?: string;
  };
  logistic?: {
    attendanceMode?: "in-person" | "digital";
    openingStatus?: "open" | "openingSoon" | "openingLater";
    availableDays?: WeekDay[];
    availableShifts?: Shift[];
  };
  proof?: {
    identification?: string; //base64
    addressProof?: string; //base64
    storeFront?: string; //base64
    storeInterior?: string; //base64
  };

  //frotend
  finished?: boolean;

  //extra
  getnet_org_id?: string;
}

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type Shift = "MORNING" | "AFTERNOON" | "EVENING";
