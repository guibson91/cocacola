import { BaseComponent } from "../../base/base.component";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Document } from "src/app/models/document";
import { User } from "src/app/models/user";
import { base64Size } from "src/app/util/file";

const MAX_SIZE_FILE = 5;

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
})
export class DocumentsComponent extends BaseComponent implements OnInit {
  @Output() next = new EventEmitter();

  documents: Document[] = [
    {
      title: "Identidade (RG ou CNH)",
      subtitle: "Selecione um arquivo",
      file: undefined,
      showError: false,
      type: "identification",
    },
    {
      title: "Comprovante de Endereço",
      subtitle: "Selecione um arquivo",
      file: undefined,
      showError: false,
      type: "addressProof",
    },
    {
      title: "Estabelecimento - Fachada",
      subtitle: "Selecione um arquivo",
      file: undefined,
      showError: false,
      type: "storeFront",
    },
    {
      title: "Estabelecimento - Interno",
      subtitle: "Selecione um arquivo",
      file: undefined,
      showError: false,
      type: "storeInterior",
    },
  ];

  constructor() {
    super();
  }

  ngOnInit() {
    this.register.clientChanged$.subscribe((client) => {
      if (client && client.proof) {
        if (client.proof.addressProof) {
          const document = this.documents.find((d) => d.type === "addressProof");
          if (document) document.file = client.proof.addressProof;
        } else {
          const document = this.documents.find((d) => d.type === "addressProof");
          if (document) document.file = undefined;
        }
        if (client.proof.identification) {
          const document = this.documents.find((d) => d.type === "identification");
          if (document) document.file = client.proof.identification;
        } else {
          const document = this.documents.find((d) => d.type === "identification");
          if (document) document.file = undefined;
        }
        if (client.proof.storeFront) {
          const document = this.documents.find((d) => d.type === "storeFront");
          if (document) document.file = client.proof.storeFront;
        } else {
          const document = this.documents.find((d) => d.type === "storeFront");
          if (document) document.file = undefined;
        }
        if (client.proof.storeInterior) {
          const document = this.documents.find((d) => d.type === "storeInterior");
          if (document) document.file = client.proof.storeInterior;
        } else {
          const document = this.documents.find((d) => d.type === "storeInterior");
          if (document) document.file = undefined;
        }
      }
    });
  }

  async nextClick() {
    const documentsWithFile = this.documents.filter((d) => d.file);
    if (documentsWithFile && documentsWithFile.length === 4) {
      const [identification, addressProof, storeFront, storeInterior] = documentsWithFile.map((d) => d.file);
      const identificationSize = identification ? base64Size(identification) : 0;
      const addressProofSize = addressProof ? base64Size(addressProof) : 0;
      const storeFrontSize = storeFront ? base64Size(storeFront) : 0;
      const storeInteriorSize = storeInterior ? base64Size(storeInterior) : 0;

      // if (identificationSize && identificationSize > MAX_SIZE_FILE) {
      //   return this.system.showAlert('none', 'Atenção', `O tamanho do arquivo de identidade (${Math.round(identificationSize * 10) / 10} MB) deve ser no máximo ${MAX_SIZE_FILE} MB }`);
      // }
      // if (addressProofSize && addressProofSize > MAX_SIZE_FILE) {
      //   return this.system.showAlert('none', 'Atenção', `O tamanho do arquivo de comprovante de endereço (${Math.round(addressProofSize * 10) / 10} MB) deve ser no máximo ${MAX_SIZE_FILE} MB }`);
      // }

      // if (storeFrontSize && storeFrontSize > MAX_SIZE_FILE) {
      //   return this.system.showAlert('none', 'Atenção', `O tamanho do arquivo de fachada de loja (${Math.round(storeFrontSize * 10) / 10} MB) deve ser no máximo ${MAX_SIZE_FILE} MB }`);
      // }

      // if (storeInteriorSize && storeInteriorSize > MAX_SIZE_FILE) {
      //   return this.system.showAlert('none', 'Atenção', `O tamanho do arquivo de interior de loja (${Math.round(storeInteriorSize * 10) / 10} MB) deve ser no máximo ${MAX_SIZE_FILE} MB }`);
      // }

      const client: User = {
        proof: {
          identification,
          addressProof,
          storeFront,
          storeInterior,
        },
      };
      this.register.client = client;
      const loading = await this.system.loadingCtrl.create({
        message: "Enviando informações",
      });
      loading.present();
      this.shared.post("register/document", this.register.client, undefined, undefined, true).subscribe((res) => {
        loading.dismiss();
        if (res.status) {
          this.next.emit();
        } else {
          this.system.showErrorAlert(new Error(res.message ? res.message : "Falha ao cadastrar documentos"));
        }
      });
    } else {
      this.system.showErrorAlert(new Error("Você precisa enviar todos os documentos"));
    }
  }

  get disabledButton(): boolean {
    const documentsWithFile = this.documents.filter((d) => d.file);
    if (documentsWithFile.length < 4) {
      return true;
    } else {
      return false;
    }
  }

  continue() {
    this.system.navCtrl.navigateRoot("login");
  }

  goBack() {
    this.back();
  }
}
