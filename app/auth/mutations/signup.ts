import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"
import { Knock } from "@knocklabs/node"

const knockClient = new Knock(process.env.KNOCK_API_KEY, { host: process.env.KNOCK_HOST })

type IdentifyPayload = {
  email: string
  name?: string
}

export default resolver.pipe(resolver.zod(Signup), async ({ email, password, name }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())

  // assume all users are signing up for the same workspace for now
  const workspace = await db.workspace.findFirst()

  const user = await db.user.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: "USER",
    },
    select: { id: true, name: true, email: true, role: true },
  })

  if (user) {
    if (workspace) {
      const worspaceSeat = await db.workspace_seat.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
        },
      })
    }

    await knockClient.users.identify(`${user.id}`, { email: user.email, name: user.name })

    await knockClient.notify("welcome", {
      data: {
        workspace: workspace?.name || "Default",
      },
      recipients: [`${user.id}`],
    })
    await ctx.session.$create({ userId: user.id, role: user.role as Role })

    return user
  }
})
