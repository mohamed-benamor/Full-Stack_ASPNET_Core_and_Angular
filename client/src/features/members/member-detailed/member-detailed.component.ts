import { Component, computed, inject, OnInit, signal } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { AgePipe } from "@pipes/age.pipe";
import { AccountService } from "@services/account.service";
import { MemberService } from "@services/member.service";
import { NotFound } from "@shared/errors/not-found/not-found.component";
import { Member } from "@types";
import { filter } from "rxjs";

@Component({
  imports: [RouterLink, RouterLinkActive, NotFound, RouterOutlet, AgePipe],
  selector: "app-member-detailed",
  templateUrl: "./member-detailed.component.html",
})
export class MemberDetailed implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accountService = inject(AccountService);

  protected readonly memberService = inject(MemberService);
  protected member = signal<Member | undefined>(undefined);
  protected title = signal("");
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get("id");
  });

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member.set(data["member"]),
    });
    this.title.set(this.route.firstChild?.snapshot.title || "Profile");

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot.title || "Profile");
      },
    });
  }
}
