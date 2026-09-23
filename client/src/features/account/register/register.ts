import { Component, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Member, RegisterRequest } from "../../../types";

@Component({
  imports: [FormsModule],
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class Register {
  protected credentials = {} as RegisterRequest;

  public members = input.required<Member[]>();

  public register() {
    console.log(this.credentials);
  }

  public cancel() {
    console.log("Cancelled");
  }
}
