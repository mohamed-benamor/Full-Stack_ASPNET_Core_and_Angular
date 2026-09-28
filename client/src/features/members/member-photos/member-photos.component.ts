import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MemberService } from "@services/member.service";
import { Photo } from "@types";
import { Observable } from "rxjs";

@Component({
  imports: [AsyncPipe],
  selector: "app-member-photos",
  templateUrl: "./member-photos.component.html",
})
export class MemberPhotos {
  private readonly service = inject(MemberService);
  private readonly route = inject(ActivatedRoute);

  protected $photos?: Observable<Photo[]>;

  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get("id");

    if (memberId) {
      this.$photos = this.service.getMemberPhotos(memberId);
    }
  }

  // get photoMocks() {
  //   return Array.from({ length: 20 }, (_, i) => ({
  //     url: `https://randomuser.me/api/portraits/women/${i}.jpg`,
  //   }));
  // }
}
