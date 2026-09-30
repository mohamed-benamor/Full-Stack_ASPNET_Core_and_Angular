import { DatePipe } from "@angular/common";
import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { MemberService } from "@services/member.service";
import { ToastService } from "@services/toast.service";
import { EditableMember, Member } from "@types";

@Component({
  imports: [DatePipe, FormsModule],
  selector: "app-member-profile",
  templateUrl: "./member-profile.component.html",
})
export class MemberProfile implements OnInit, OnDestroy {
  private readonly toast = inject(ToastService);

  protected readonly service = inject(MemberService);
  protected editableMember: EditableMember = {
    displayName: "",
    description: "",
    city: "",
    country: "",
  };

  @ViewChild("editForm") public editForm?: NgForm;

  @HostListener("window:beforeunload", ["$event"]) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  public ngOnInit(): void {
    this.editableMember = {
      displayName: this.service.member()?.displayName || "",
      description: this.service.member()?.description || "",
      city: this.service.member()?.city || "",
      country: this.service.member()?.country || "",
    };
  }

  public updateProfile() {
    if (!this.service.member()) {
      return;
    }

    const updateMember = { ...this.service.member(), ...this.editableMember };

    this.service.updateMember(this.editableMember).subscribe({
      next: () => {
        this.toast.success("Profile updated successfully");
        this.service.editMode.set(false);
        this.service.member.set(updateMember as Member);
        this.editForm?.reset(updateMember);
      },
    });
  }

  public ngOnDestroy(): void {
    this.service.editMode.set(false);
  }
}
