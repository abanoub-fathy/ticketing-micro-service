import { hash, compare } from "bcryptjs";

export class Password {
  static async toHash(password: string): Promise<string> {
    return await hash(password, 10);
  }

  static async isCorrectPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
