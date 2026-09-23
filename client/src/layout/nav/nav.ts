import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AccountService } from "../../core/services/account-service";

@Component({
  imports: [FormsModule],
  selector: "app-nav",
  templateUrl: "./nav.component.html",
})
export class Nav {
  private service = inject(AccountService);

  protected title = signal("Logo");
  protected credentials = { email: "", password: "" };

  public login() {
    this.service.login(this.credentials).subscribe({
      next: (result) => console.log(result),
      error: (error) => alert(error.message),
    });
  }
}
