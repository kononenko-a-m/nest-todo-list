export class NoAccessError extends Error {
  constructor(subject: string, operation: string) {
    super(
      `Subject "${subject}" tried to ${operation}, but it has no access to it`,
    );
  }
}
