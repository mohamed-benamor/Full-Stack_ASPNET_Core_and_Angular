import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AccountService } from "../../core/services/account-service";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  imports: [FormsModule, RouterLink, RouterLinkActive],
  selector: "app-nav",
  templateUrl: "./nav.component.html",
})
export class Nav {
  private router = inject(Router);

  protected title = signal("Logo");
  protected service = inject(AccountService);
  protected credentials = { email: "", password: "" };

  public login() {
    this.service.login(this.credentials).subscribe({
      next: (_) => {
        this.router.navigateByUrl("/members");
        this.credentials = { email: "", password: "" };
      },
      error: (error) => alert(error.message),
    });
  }

  public logout() {
    this.service.logout();
    this.router.navigateByUrl("/");
  }
}
