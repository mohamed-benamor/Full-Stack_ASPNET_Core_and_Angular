import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError } from "rxjs";
import { ToastService } from "../services/toast.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (typeof error.error === "string") {
              toast.error(error.error);
            } else {
              toast.error(error.error.title);
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
