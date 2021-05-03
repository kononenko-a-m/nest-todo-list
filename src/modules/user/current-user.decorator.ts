import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, req) => {
  return req.args[0].user;
});
