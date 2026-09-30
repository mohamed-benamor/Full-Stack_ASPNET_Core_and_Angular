import { DatePipe } from "@angular/common";
import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MemberService } from "@services/member.service";
import { ToastService } from "@services/toast.service";
import { EditableMember, Member } from "@types";

@Component({
  imports: [DatePipe, FormsModule],
  selector: "app-member-profile",
  templateUrl: "./member-profile.component.html",
})
export class MemberProfile implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  @ViewChild("editForm") protected editForm?: NgForm;

  protected readonly memberService = inject(MemberService);
  protected member = signal<Member | undefined>(undefined);
  protected editableMember: EditableMember = {
    displayName: "",
    description: "",
    city: "",
    country: "",
  };

  public ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.member.set(data["member"]);
    });
    this.editableMember = {
      displayName: this.member()?.displayName || "",
      description: this.member()?.description || "",
      city: this.member()?.city || "",
      country: this.member()?.country || "",
    };
  }

  public updateProfile() {
    if (!this.member()) {
      return;
    }

    const updateMember = { ...this.member(), ...this.editableMember };

    console.log(updateMember);

    this.toast.success("Profile updated successfully");
    this.memberService.editMode.set(false);
  }

  public ngOnDestroy(): void {
    this.memberService.editMode.set(false);
  }
}
