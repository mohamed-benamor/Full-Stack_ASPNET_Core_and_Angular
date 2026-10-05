import { Component, input, Self } from "@angular/core";
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  imports: [ReactiveFormsModule],
  selector: "app-text-input",
  templateUrl: "./text-input.component.html",
})
export class TextInput implements ControlValueAccessor {
  public label = input.required<string>();
  public type = input.required<"text" | "email" | "password" | "date">();
  public maxDate = input("");

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  public writeValue(obj: any) {}
  public registerOnChange(fn: any) {}
  public registerOnTouched(fn: any) {}
  public setDisabledState?(isDisabled: boolean) {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
