import { JsonPipe } from "@angular/common";
import { Component, inject, OnInit, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AccountService } from "@services/account.service";
import { RegisterRequest } from "@types";

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class Register implements OnInit {
  private service = inject(AccountService);

  protected credentials = {} as RegisterRequest;
  protected registerForm: FormGroup = new FormGroup({});

  public cancelRegister = output<boolean>();

  public ngOnInit(): void {
    this.initializeFrom();
  }

  initializeFrom() {
    this.registerForm = new FormGroup({
      email: new FormControl(),
      displayName: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl(),
    });
  }

  public register() {
    console.log(this.registerForm.value);
    // this.service.register(this.credentials).subscribe({
    //   next: response => {
    //     console.log(response);
    //     this.cancel();
    //   },
    //   error: error => console.error(error.message),
    // });
  }

  public cancel() {
    this.cancelRegister.emit(false);
  }
}
