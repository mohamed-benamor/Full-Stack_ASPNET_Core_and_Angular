import { AsyncPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { MemberService } from "@services/member.service";
import { Member } from "@types";
import { filter, Observable } from "rxjs";
import { NotFound } from "@shared/errors/not-found/not-found.component";

@Component({
  imports: [AsyncPipe, RouterLink, RouterLinkActive, NotFound, RouterOutlet],
  selector: "app-member-detailed",
  templateUrl: "./member-detailed.component.html",
})
export class MemberDetailed implements OnInit {
  private readonly service = inject(MemberService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected $member?: Observable<Member>;
  protected title = signal("");

  ngOnInit(): void {
    this.$member = this.loadMember();
    this.title.set(this.route.firstChild?.snapshot.title || "Profile");

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot.title || "Profile");
      },
    });
  }

  private loadMember() {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      return;
    }

    return (this.$member = this.service.getMember(id));
  }
}
