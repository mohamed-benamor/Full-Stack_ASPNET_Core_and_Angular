import { Component, inject, OnInit, signal } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { NotFound } from "@shared/errors/not-found/not-found.component";
import { Member } from "@types";
import { filter } from "rxjs";

@Component({
  imports: [RouterLink, RouterLinkActive, NotFound, RouterOutlet],
  selector: "app-member-detailed",
  templateUrl: "./member-detailed.component.html",
})
export class MemberDetailed implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected member = signal<Member | undefined>(undefined);
  protected title = signal("");

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
