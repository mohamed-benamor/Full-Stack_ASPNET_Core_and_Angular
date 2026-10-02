import { JsonPipe } from "@angular/common";
import { Component, inject, output, signal } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { FIRST_REGISTER_FORM_STEP, MAX_REGISTER_FORM_STEPS } from "@constants";
import { AccountService } from "@services/account.service";
import { TextInput } from "@shared/text-input/text-input.component";

@Component({
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class Register {
  private readonly service = inject(AccountService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly credentialsForm: FormGroup;
  protected readonly profileForm: FormGroup;
  protected currentStep = signal(1);

  protected cancelRegister = output<boolean>();

  public constructor() {
    this.credentialsForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      displayName: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      confirmPassword: ["", [Validators.required, this.matchValues("password")]],
    });

    this.profileForm = this.formBuilder.group({
      gender: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
    });

    this.credentialsForm.controls["password"].valueChanges.subscribe(() => {
      this.credentialsForm.controls["confirmPassword"].updateValueAndValidity();
    });
  }

  protected register() {
    console.log(this.credentialsForm.value);

    if (this.credentialsForm.valid && this.profileForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value };

      console.log("From data: ", formData);
    }
    // this.service.register(this.credentials).subscribe({
    //   next: response => {
    //     console.log(response);
    //     this.cancel();
    //   },
    //   error: error => console.error(error.message),
    // });
  }

  protected cancel() {
    this.cancelRegister.emit(false);
  }

  protected nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => Math.min(MAX_REGISTER_FORM_STEPS, prevStep + 1));
    }
  }

  protected prevStep() {
    this.currentStep.update(prevStep => Math.max(FIRST_REGISTER_FORM_STEP, prevStep - 1));
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
