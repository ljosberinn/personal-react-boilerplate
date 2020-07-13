export const RequestMethods = [
  'put',
  'patch',
  'get',
  'delete',
  'head',
  'post',
  'options',
  'trace',
] as const;

export type RequestInitMethod = typeof RequestMethods[number];
