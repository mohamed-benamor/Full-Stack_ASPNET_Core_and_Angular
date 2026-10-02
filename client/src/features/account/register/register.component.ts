import { JsonPipe } from "@angular/common";
import { Component, inject, OnInit, output } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AccountService } from "@services/account.service";
import { RegisterRequest } from "@types";
import { TextInput } from "@shared/text-input/text-input.component";

@Component({
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
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

  private initializeFrom() {
    this.registerForm = new FormGroup({
      email: new FormControl("johndoe@test.com", [Validators.required, Validators.email]),
      displayName: new FormControl("", [Validators.required]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(16),
      ]),
      confirmPassword: new FormControl("", [Validators.required, this.matchValues("password")]),
    });

    this.registerForm.controls["password"].valueChanges.subscribe(() => {
      this.registerForm.controls["confirmPassword"].updateValueAndValidity();
    });
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;

      if (!parent) {
        return null;
      }

      const matchValue = parent.get(matchTo)?.value;

      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }
}
