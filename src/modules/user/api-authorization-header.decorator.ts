import { ApiHeader, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiAuthorizationHeaderDecorator = (): MethodDecorator => {
  const headerDecorator = ApiHeader({
    name: 'Authorization',
    required: true,
    description:
      'Authorization header with JWT token, ex: `Authorization: Bearer $JWT_TOKEN`',
  });
  const responseDecorator = ApiUnauthorizedResponse({
    description: 'User not provided JWT token, or JWT token is not valid',
  });

  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const changedDescriptor =
      headerDecorator(target, propertyKey, descriptor) || descriptor;

    return responseDecorator(target, propertyKey, changedDescriptor);
  };
};
