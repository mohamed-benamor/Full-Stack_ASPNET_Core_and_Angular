import { Location } from "@angular/common";
import { Component, inject } from "@angular/core";

@Component({
  imports: [],
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
})
export class NotFound {
  private location = inject(Location);

  protected goBack() {
    this.location.back();
  }
}
