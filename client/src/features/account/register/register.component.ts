import { JsonPipe } from "@angular/common";
import { Component, inject, output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AccountService } from "@services/account.service";
import { TextInput } from "@shared/text-input/text-input.component";
import { RegisterRequest } from "@types";

@Component({
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class Register {
  private readonly service = inject(AccountService);
  private readonly formBuilder = inject(FormBuilder);

  protected credentials = {} as RegisterRequest;
  protected readonly registerForm: FormGroup;

  public cancelRegister = output<boolean>();

  constructor() {
    this.registerForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      displayName: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      confirmPassword: ["", [Validators.required, this.matchValues("password")]],
    });

    this.registerForm.controls["password"].valueChanges.subscribe(() => {
      this.registerForm.controls["confirmPassword"].updateValueAndValidity();
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
