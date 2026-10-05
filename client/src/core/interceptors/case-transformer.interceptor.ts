import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { keysToCamel, keysToKebab } from "@utils";
import { map } from "rxjs";

export const caseTransformerInterceptor: HttpInterceptorFn = (req, next) => {
  const outgoing = req.body ? req.clone({ body: keysToKebab(req.body) }) : req;

  return next(outgoing).pipe(
    map(event =>
      event instanceof HttpResponse && event.body
        ? event.clone({ body: keysToCamel(event.body) })
        : event,
    ),
  );
};
