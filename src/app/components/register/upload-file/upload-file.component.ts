import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { BaseComponent } from "../../base/base.component";
import { Document } from "src/app/models/document";
import { Camera, CameraDirection, CameraPluginPermissions, CameraResultType, CameraSource, PermissionStatus, Photo } from "@capacitor/camera";

@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.scss"],
})
export class UploadFileComponent extends BaseComponent {
  @ViewChild("fileInput") fileInput: any;
  @Input() accept: string = "image/*";
  @Input() document: Document;
  @Output() upload = new EventEmitter();

  constructor() {
    super();
  }

  uploadDocument() {
    this.upload.emit("214324523");
  }
  processWebImage(event): void {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let file = (readerEvent.target as any).result;

      if (file) {
        this.document.file = file;
        this.document.subtitle = "Arquivo salvo";
        this.document.showError = false;
      } else {
        console.error("Arquivo não selecionado");
        if (this.document.file) {
          this.document.subtitle = "Arquivo salvo";
        } else {
          this.document.subtitle = "Selecione um arquivo";
        }
      }
    };
    // Se não possui arquivos
    if (!event.target.files[0]) return;

    //Ler o arquivo Blob e renderiza a imagem (local)
    reader.readAsDataURL(event.target.files[0]);
    reader.onerror = (error) => {
      console.error("reader onerror: ", error);
      if (this.document.file) {
        this.document.subtitle = "Arquivo salvo";
      } else {
        this.document.subtitle = "Selecione um arquivo";
      }
    };
  }

  getPicture(): void {
    this.fileInput.nativeElement.click();
  }

  async selectImage() {
    if (this.document.subtitle == "Carregando arquivo") return;
    if (this.shared.platform.is("capacitor")) {
      this.system.showAlert(
        "default",
        "Selecione uma opção",
        "Selecione se deseja tirar uma foto ou importar de sua galeria",
        "Câmera",
        () => {
          this.takePicture(CameraSource.Camera);
        },
        "Galeria",
        () => {
          this.takePicture(CameraSource.Photos);
        },
        false,
        true,
      );
    } else {
      this.getPicture();
    }
  }

  takePicture(source: CameraSource) {
    const permissions: CameraPluginPermissions = {
      permissions: ["camera", "photos"],
    };
    Camera.requestPermissions(permissions)
      .then(async (res: PermissionStatus) => {
        if (res.camera === "granted" && res.photos === "granted") {
          const photo: Photo = await Camera.getPhoto({
            quality: 50,
            width: 1600,
            height: 1200,
            source: source,
            correctOrientation: true,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            promptLabelCancel: "Cancelar",
            promptLabelPhoto: "Galeria",
            promptLabelHeader: "Fotos",
            promptLabelPicture: "Câmera",
            direction: CameraDirection.Front,
            saveToGallery: true,
          });
          if (photo.dataUrl) {
            this.document.file = photo.dataUrl;
            this.document.subtitle = "Arquivo salvo";
            this.document.showError = false;
          }
        }
      })
      .catch((err) => {
        console.error("Error requestPermissions: ", err);
        if (this.document.file) {
          this.document.subtitle = "Arquivo salvo";
        } else {
          this.document.subtitle = "Selecione um arquivo";
        }
      });
  }
}
