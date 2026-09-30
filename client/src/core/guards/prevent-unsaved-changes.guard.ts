import { CanDeactivateFn } from "@angular/router";
import { MemberProfile } from "@features/members/member-profile/member-profile.component";

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = component => {
  if (component.editForm?.dirty) {
    return confirm("Ary you sure you want to continue?\nAll unsaved changes will be lost");
  }

  return true;
};
