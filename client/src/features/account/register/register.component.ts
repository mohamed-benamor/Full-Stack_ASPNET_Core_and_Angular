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
import { Router } from "@angular/router";
import { FIRST_REGISTER_FORM_STEP, MAX_REGISTER_FORM_STEPS } from "@constants";
import { AccountService } from "@services/account.service";
import { TextInput } from "@shared/text-input/text-input.component";

@Component({
  imports: [ReactiveFormsModule, TextInput],
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class Register {
  private readonly service = inject(AccountService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly credentialsForm: FormGroup;
  protected readonly profileForm: FormGroup;
  protected readonly currentStep = signal(1);
  protected readonly validationErrors = signal<string[]>([]);

  protected readonly cancelRegister = output<boolean>();

  public constructor() {
    this.credentialsForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      displayName: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      confirmPassword: ["", [Validators.required, this.matchValues("password")]],
    });

    this.profileForm = this.formBuilder.group({
      gender: ["male", Validators.required],
      dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
    });

    this.credentialsForm.controls["password"].valueChanges.subscribe(() => {
      this.credentialsForm.controls["confirmPassword"].updateValueAndValidity();
    });
  }

  protected register() {
    if (this.credentialsForm.valid && this.profileForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value };

      this.service.register(formData).subscribe({
        next: () => this.router.navigateByUrl("/members"),
        error: error => {
          console.error(error);
          this.validationErrors.set(error);
        },
      });
    }
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

  protected getMaxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);

    return today.toISOString().split("T")[0];
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
