import { Component, inject, OnInit, signal } from "@angular/core";
import { LikesService } from "@services/likes.service";
import { Member } from "@types";
import { MemberCard } from "@features/members/member-card/member-card.component";

@Component({
  imports: [MemberCard],
  selector: "app-lists",
  templateUrl: "./lists.component.html",
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);

  protected members = signal<Member[]>([]);
  protected predicate = "liked";
  protected tabs = [
    { label: "Liked", value: "liked" },
    { label: "Liked me", value: "likedBy" },
    { label: "Mutual", value: "mutual" },
  ];

  public ngOnInit() {
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    if (this.predicate) {
      this.predicate = predicate;
      this.loadLikes();
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate).subscribe({
      next: members => this.members.set(members),
    });
  }
}
