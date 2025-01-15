import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  storageInstance;

  constructor(public storage: Storage) {}

  async init(): Promise<Storage> {
    const storage = await this.storage.create();
    this.storageInstance = storage;
    return storage;
  }

  public async set(key: string, value: any): Promise<any> {
    if (!this.storageInstance) {
      await this.init();
    }
    return this.storageInstance.set(key, value);
  }

  public async get(key: string): Promise<any> {
    if (!this.storageInstance) {
      await this.init();
    }
    return this.storageInstance.get(key);
  }
}
