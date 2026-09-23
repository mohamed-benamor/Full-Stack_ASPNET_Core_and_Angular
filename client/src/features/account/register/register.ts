import { Component, inject, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Member, RegisterRequest } from "../../../types";
import { AccountService } from "../../../core/services/account-service";

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
      next: (response) => {
        console.log(response);
        this.cancel();
      },
      error: (error) => console.error(error.message),
    });
  }

  public cancel() {
    this.cancelRegister.emit(false);
  }
}
