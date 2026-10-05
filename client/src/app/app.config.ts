import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { InitService } from "@services/init.service";
import { lastValueFrom } from "rxjs";
import { errorInterceptor } from "@interceptors/error.interceptor";
import { jwtInterceptor } from "@interceptors/jwt.interceptor";
import { loadingInterceptor } from "@interceptors/loading.interceptor";
import { caseTransformerInterceptor } from "@interceptors/case-transformer.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        jwtInterceptor,
        loadingInterceptor,
        caseTransformerInterceptor,
      ]),
    ),
    provideAppInitializer(async () => {
      const service = inject(InitService);

      return new Promise<void>(resolve => {
        setTimeout(() => {
          try {
            return lastValueFrom(service.init());
          } finally {
            const splash = document.getElementById("initial-splash");

            if (splash) {
              splash.remove();
            }

            resolve();
          }
        }, 500);
      });
    }),
  ],
};
