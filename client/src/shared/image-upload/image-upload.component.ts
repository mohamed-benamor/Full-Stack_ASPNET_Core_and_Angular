import { Component, input, output, signal } from "@angular/core";

@Component({
  imports: [],
  selector: "app-image-upload",
  templateUrl: "./image-upload.component.html",
})
export class ImageUpload {
  private fileToUpload: File | null = null;

  protected readonly imageSrc = signal<string | ArrayBuffer | null | undefined>(null);
  protected readonly uploadFile = output<File>();
  protected isDragging = false;

  public readonly loading = input<boolean>(false);

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  protected onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  protected onCancel() {
    this.fileToUpload = null;
    this.imageSrc.set(null);
  }

  protected onUploadFile() {
    if (this.fileToUpload) {
      this.uploadFile.emit(this.fileToUpload);
    }
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileToUpload = file;
    }
  }

  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = e => this.imageSrc.set(e.target?.result);
    reader.readAsDataURL(file);
  }
}
