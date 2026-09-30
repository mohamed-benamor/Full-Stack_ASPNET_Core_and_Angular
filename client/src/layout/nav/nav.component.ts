import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AccountService } from "@services/account.service";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from "@services/toast.service";
import { themes } from "@constants";

@Component({
  imports: [FormsModule, RouterLink, RouterLinkActive],
  selector: "app-nav",
  templateUrl: "./nav.component.html",
})
export class Nav implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);

  protected title = signal("Logo");
  protected service = inject(AccountService);
  protected credentials = { email: "", password: "" };
  protected selectedTheme = signal<string>(localStorage.getItem("theme") || "light");
  protected themes = themes;

  protected handleSelectedTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    const element = document.activeElement as HTMLDivElement;

    if (element) {
      element.blur();
    }
  }

  public ngOnInit(): void {
    document.documentElement.setAttribute("data-theme", this.selectedTheme());
  }

  public login() {
    this.service.login(this.credentials).subscribe({
      next: () => {
        this.router.navigateByUrl("/members");
        this.toast.success("Logged in successfully");
        this.credentials = { email: "", password: "" };
      },
      error: error => {
        const email = error?.error?.errors?.email;
        const password = error?.error?.errors?.password;

        if (email) {
          this.toast.error("Invalid email");
        }

        if (password) {
          this.toast.error("Invalid password");
        }
      },
    });
  }

  public logout() {
    this.service.logout();
    this.router.navigateByUrl("/");
    this.toast.info("Logged out");
  }
}
