export class UserNotExistsError extends Error {
  constructor(email: string) {
    super(`User with ${email} email doesn't exists`);
  }
}
