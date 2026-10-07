import { Component, computed, inject, input } from "@angular/core";
import { Member } from "@types";
import { RouterLink } from "@angular/router";
import { AgePipe } from "@pipes/age.pipe";
import { LikesService } from "@services/likes.service";

@Component({
  imports: [RouterLink, AgePipe],
  selector: "app-member-card",
  templateUrl: "./member-card.component.html",
})
export class MemberCard {
  private readonly likeService = inject(LikesService);

  protected readonly hasLiked = computed(() =>
    this.likeService.likeIds().includes(this.member().id),
  );

  public readonly member = input.required<Member>();

  protected toggleLike(event: Event) {
    event.stopPropagation();

    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update(ids =>
            ids.filter(memberId => memberId !== this.member().id),
          );
        } else {
          this.likeService.likeIds.update(ids => [...ids, this.member().id]);
        }
      },
    });
  }
}
