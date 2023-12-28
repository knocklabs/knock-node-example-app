import { resolver, SecurePassword, AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { Role } from "types"
import { Knock } from "@knocklabs/node"
import jwt from "jsonwebtoken"

const knockClient = new Knock(process.env.KNOCK_API_KEY, {
  host: process.env.KNOCK_API_URL,
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

  const signingKey = process.env.KNOCK_SIGNING_KEY
  // JWT NumericDates specified in seconds:
  const currentTime = Math.floor(Date.now() / 1000)

  // Default to 1 hour from now
  const expireInSeconds = 60 * 60

  // Get objects user needs access to within the project (?)
  // add to the grants
  // Store token in local storage
  // pull it out when sending this request
  const token = jwt.sign(
    {
      sub: user.id.toString(),
      iat: currentTime,
      exp: currentTime + expireInSeconds,
      grants: {
        "https://api.knock.app/v1/objects/$tenants/tenant12345": {
          "slack/channels_read": [{}],
        },
        "https://api.knock.app/v1/objects/projects2/slack_chann_test": {
          "channel_data/read": [{}],
          "channel_data/write": [{}],
        },
      },
    },
    signingKey,
    {
      algorithm: "RS256",
    }
  )

  const { hashedPassword, ...rest } = user

  // Identify the user - this should have happened in the seed file already but we're doing it
  // here in case of changes to the environment/API key
  await knockClient.users.identify(`${user.id}`, { email: user.email, name: user.name })

  return { token, ...rest }
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  return user
})
