import { HttpInterceptorFn } from "@angular/common/http";
import { inject, model } from "@angular/core";
import { catchError } from "rxjs";
import { ToastService } from "../services/toast.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const errors = error.error.errors;
              const modelStateErrors = [];

              for (const key in errors) {
                if (errors[key]) {
                  modelStateErrors.push(errors[key]);
                }
              }

              throw modelStateErrors.flat();
            } else {
              toast.error(`${error.error} ${error.status}`);
            }
            break;

          case 401:
            toast.error("Unauthorized");
            break;

          case 404:
            toast.error("Not Found");
            break;

          case 500:
            toast.error("Server error");
            break;

          default:
            toast.error("Something went wrong");
        }
      }

      throw error;
    }),
  );
};
