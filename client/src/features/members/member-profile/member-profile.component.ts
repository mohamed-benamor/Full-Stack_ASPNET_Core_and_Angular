import { DatePipe } from "@angular/common";
import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { AccountService } from "@services/account.service";
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
  private readonly accountService = inject(AccountService);

  protected readonly memberService = inject(MemberService);
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
      displayName: this.memberService.member()?.displayName || "",
      description: this.memberService.member()?.description || "",
      city: this.memberService.member()?.city || "",
      country: this.memberService.member()?.country || "",
    };
  }

  public updateProfile() {
    if (!this.memberService.member()) {
      return;
    }

    const updateMember = { ...this.memberService.member(), ...this.editableMember };

    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();

        if (currentUser && updateMember.displayName !== currentUser.displayName) {
          currentUser.displayName = updateMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }

        this.toast.success("Profile updated successfully");
        this.memberService.editMode.set(false);
        this.memberService.member.set(updateMember as Member);
        this.editForm?.reset(updateMember);
      },
    });
  }

  public ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}
