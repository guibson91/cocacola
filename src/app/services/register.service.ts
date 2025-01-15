import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  private _client: User = {};
  cpfCnpj: string;
  // private _client: User = {
  //   userStatus: 'no_register',
  //   cpfCnpj: '03487528304',
  //   company: {
  //     cnpj: '87.037.098/0001-30',
  //     name: 'Razão social guibson'
  //   },
  //   responsible: {
  //     email: 'guibson1991@gmail.com',
  //     cellphone: '85996942049',
  //     firstName: 'Guibson',
  //     lastName: 'Martins',
  //     birthday: '1991-04-02'
  //   }
  // };

  clientChanged$ = new ReplaySubject<User>();

  constructor() {}

  get isCpf(): boolean {
    return !!this.client.cpfCnpj && this.client.cpfCnpj.length === 11;
  }

  //Verifica se usuário já tem cadastro na base do cliente
  get isClientDb(): boolean {
    return this._client.userStatus === "db_client" || this._client.userStatus === "db_client_created";
  }

  get client(): User {
    return this._client;
  }

  set client(client: User) {
    const merged = _.merge(this._client, client);
    this._client = merged;

    this.clientChanged$.next(merged);
  }

  clearClient(cleanCpfCnpj?: boolean) {
    this._client = {};
    if (!cleanCpfCnpj) {
      const cpfCnpj = this.client.cpfCnpj;
      const client = {
        cpfCnpj,
      };
      this.client = client;
    }
    try {
      this.clientChanged$.next(this.client);
    } catch (error) {}
  }
}
