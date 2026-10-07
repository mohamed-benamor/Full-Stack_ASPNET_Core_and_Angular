class PagingParams {
  pageNumber = 1;
  pageSize = 10;
}

export class MemberParams extends PagingParams {
  gender?: string;
  minAge = 18;
  maxAge = 99;
  orderBy = "lastActive";
}

export class LikesParams extends PagingParams {
  predicate = "liked";
}
