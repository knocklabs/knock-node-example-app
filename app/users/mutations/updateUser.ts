import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

import { Knock, Recipient } from "@knocklabs/node"

const knockClient = new Knock(process.env.KNOCK_API_KEY)

const UpdateUser = z.object({
  name: z.string(),
  newCommentNotifications: z.string().array(),
})

export default resolver.pipe(
  resolver.zod(UpdateUser),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const userId = session.userId

    if (userId) {
      const updated = await db.user.update({
        where: {
          id: userId,
        },
        data: input,
      })

      // Sync user data on Knock
      await knockClient.users.identify(`${userId}`, { name: input.name })

      // First we need to get the user preferences from Knock
      const preferences = await knockClient.users.getPreferences(`${userId}`)
      const updatedPreferences = {
        ...preferences,
        channel_types: {
          email: input.newCommentNotifications.includes("email"),
          in_app_feed: input.newCommentNotifications.includes("in_app_feed"),
        },
      }

      // Sync preferences with the updated email preferences
      await knockClient.users.setPreferences(`${userId}`, updatedPreferences)
    }
  }
)
