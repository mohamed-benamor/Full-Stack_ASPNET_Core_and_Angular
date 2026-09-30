import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { MemberService } from "@services/member.service";
import { Member } from "@types";
import { EMPTY } from "rxjs";

export const memberResolver: ResolveFn<Member> = route => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const memberId = route.paramMap.get("id");

  if (!memberId) {
    router.navigateByUrl("/not-found");
    return EMPTY;
  }

  return memberService.getMember(memberId);
};
