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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor])),
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
