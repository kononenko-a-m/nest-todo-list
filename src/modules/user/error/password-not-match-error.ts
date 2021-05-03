export class PasswordNotMatchError extends Error {
  constructor(email: string) {
    super(`Provided password for ${email} not match`);
  }
}
