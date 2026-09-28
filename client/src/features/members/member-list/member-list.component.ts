import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MemberService } from "@services/member.service";
import { Member } from "@types";
import { Observable } from "rxjs";

@Component({
  imports: [AsyncPipe],
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
})
export class MemberList {
  private readonly service = inject(MemberService);

  protected members: Observable<Member[]>;

  constructor() {
    this.members = this.service.getMembers();
  }
}
