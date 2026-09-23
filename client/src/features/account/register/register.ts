import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RegisterRequest } from "../../../types";

@Component({
  imports: [FormsModule],
  selector: "app-register",
  templateUrl: "./register.html",
})
export class Register {
  protected credentials = {} as RegisterRequest;

  public register() {
    console.log(this.credentials);
  }

  public cancel() {
    console.log("Cancelled");
  }
}
