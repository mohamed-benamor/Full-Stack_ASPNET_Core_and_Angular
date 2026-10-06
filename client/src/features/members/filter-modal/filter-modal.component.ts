import { Component, ElementRef, model, output, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MAX_AGE, MIN_AGE } from "@constants";
import { MemberParams } from "@types";

@Component({
  imports: [FormsModule],
  selector: "app-filter-model",
  templateUrl: "./filter-modal.component.html",
})
export class FilterModal {
  @ViewChild("filterModal") private modalRef!: ElementRef<HTMLDialogElement>;
  protected readonly minAge = MIN_AGE;
  protected readonly maxAge = MAX_AGE;

  protected readonly closeModel = output();
  protected readonly submitData = output<MemberParams>();
  protected readonly memberParams = model(new MemberParams());

  constructor() {
    const filters = localStorage.getItem("filters");

    if (filters) {
      this.memberParams.set(JSON.parse(filters));
    }
  }

  public open() {
    this.modalRef.nativeElement.showModal();
  }

  protected close() {
    this.modalRef.nativeElement.close();
    this.closeModel.emit();
  }

  protected submit() {
    this.submitData.emit(this.memberParams());
    this.close();
  }

  protected onMinAgeChange() {
    if (this.memberParams().minAge < this.minAge) {
      this.memberParams().minAge = this.minAge;
    }
  }

  protected onMaxAgeChange() {
    if (this.memberParams().maxAge < this.memberParams().minAge) {
      this.memberParams().maxAge = this.memberParams().minAge;
    }

    if (this.memberParams().maxAge > this.maxAge) {
      this.memberParams().maxAge = this.maxAge;
    }
  }
}
