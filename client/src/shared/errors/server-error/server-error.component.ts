import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ApiError } from "@types";

@Component({
  imports: [],
  selector: "app-server-error",
  templateUrl: "./server-error.component.html",
})
export class ServerError {
  private router = inject(Router);

  protected readonly error: ApiError;
  protected showDetails = false;

  constructor() {
    const navigation = this.router.currentNavigation();
    this.error = navigation?.extras?.state?.["error"];
  }

  protected detailsToggle() {
    this.showDetails = !this.showDetails;
  }
}
