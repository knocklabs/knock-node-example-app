import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"

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
      await db.workspace_seat.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
        },
      })
    }

    /*
    TODO: ADD KNOCK - NOTIFY
    Trigger the "welcome" workflow and inline-identify the recipient
    */

    await ctx.session.$create({ userId: user.id, role: user.role as Role })

    return { user }
  }
})
