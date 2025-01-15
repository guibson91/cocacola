import { Observable, map } from "rxjs";
import { Address, CorreiosResponse } from "../models/address";
import Axios, { AxiosObservable } from "axios-observable";
import { addressDTO } from "./address";

export const getAddressByCep = (postalCode): Observable<Address | null> => {
  return Axios.get<AxiosObservable<CorreiosResponse>>(`https://viacep.com.br/ws/${postalCode}/json`).pipe(
    map((res) => {
      if ((res.data as CorreiosResponse).erro === "true" || (res.data as CorreiosResponse).erro === true) {
        return null;
      } else {
        return addressDTO(res.data as CorreiosResponse) as Address;
      }
    }),
  );
};
