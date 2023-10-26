import { resolver, SecurePassword, AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { Role } from "types"
import { Knock } from "@knocklabs/node"

const knockClient = new Knock(process.env.KNOCK_API_KEY, {
  host: "https://046a-135-84-167-61.ngrok-free.app",
})

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })

  const user = await db.user.findFirst({ where: { email } })

  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user

  // Identify the user - this should have happened in the seed file already but we're doing it
  // here in case of changes to the environment/API key
  await knockClient.users.identify(`${user.id}`, { email: user.email, name: user.name })

  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  return user
})
