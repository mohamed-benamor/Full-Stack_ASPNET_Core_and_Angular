import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MemberService } from "@services/member.service";
import { ImageUpload } from "@shared/image-upload/image-upload.component";
import { Photo } from "@types";

@Component({
  imports: [ImageUpload],
  selector: "app-member-photos",
  templateUrl: "./member-photos.component.html",
})
export class MemberPhotos implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly service = inject(MemberService);
  protected readonly photos = signal<Photo[]>([]);
  protected readonly loading = signal(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get("id");

    if (memberId) {
      this.service.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos),
      });
    }
  }

  protected onUploadImage(file: File) {
    this.loading.set(true);
    this.service.updatePhoto(file).subscribe({
      next: photo => {
        this.service.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
      },
      error: error => {
        console.log(`Error uploading image: ${error}`);
        this.loading.set(false);
      },
    });
  }
}
