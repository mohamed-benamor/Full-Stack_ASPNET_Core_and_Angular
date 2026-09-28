import { Component, inject, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AccountService } from "@services/account.service";
import { RegisterRequest } from "@types";

@Component({
  imports: [FormsModule],
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class Register {
  private service = inject(AccountService);

  protected credentials = {} as RegisterRequest;

  public cancelRegister = output<boolean>();

  public register() {
    this.service.register(this.credentials).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.error(error.message),
    });
  }

  public cancel() {
    this.cancelRegister.emit(false);
  }
}
