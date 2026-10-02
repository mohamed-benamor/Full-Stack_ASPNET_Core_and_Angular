import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "@services/account.service";
import { MemberService } from "@services/member.service";
import { ImageUpload } from "@shared/image-upload/image-upload.component";
import { Member, Photo, User } from "@types";
import { StarButton } from "@shared/star-button/star-button.component";
import { DeleteButton } from "@shared/delete-button/delete-button.component";

@Component({
  imports: [ImageUpload, StarButton, DeleteButton],
  selector: "app-member-photos",
  templateUrl: "./member-photos.component.html",
})
export class MemberPhotos implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly memberService = inject(MemberService);
  protected readonly accountService = inject(AccountService);
  protected readonly photos = signal<Photo[]>([]);
  protected readonly loading = signal(false);

  public ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get("id");

    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos),
      });
    }
  }

  protected onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.updatePhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
      },
      error: error => {
        console.log(`Error uploading image: ${error}`);
        this.loading.set(false);
      },
    });
  }

  protected updateProfilePhoto(photo: Photo) {
    this.memberService.updateProfilePhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();

        if (currentUser) {
          currentUser.imageUrl = photo.url;
        }

        this.accountService.setCurrentUser(currentUser as User);

        this.memberService.member.update(
          member =>
            ({
              ...member,
              imageUrl: photo.url,
            }) as Member,
        );
      },
    });
  }

  protected deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(photo => photo.id !== photoId));
      },
    });
  }
}
