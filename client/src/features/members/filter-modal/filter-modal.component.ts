import { Component, ElementRef, output, ViewChild } from "@angular/core";
import { MemberParams } from "@types";

@Component({
  imports: [],
  selector: "app-filter-model",
  templateUrl: "./filter-modal.component.html",
})
export class FilterModal {
  @ViewChild("filterModal") private modalRef!: ElementRef<HTMLDialogElement>;

  protected closeModel = output();
  protected submitData = output<MemberParams>();

  public open() {
    this.modalRef.nativeElement.showModal();
  }

  protected close() {
    this.modalRef.nativeElement.close();
    this.closeModel.emit();
  }

  protected submit() {
    this.submitData.emit(new MemberParams());
    this.close();
  }
}
