import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"
import { Knock } from "@knocklabs/node"

const knockClient = new Knock(process.env.KNOCK_API_KEY)

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

    // Identify user on Knock so we the data is accesible when triggering workflows
    await knockClient.users.identify(`${user.id}`, { email: user.email, name: user.name })

    // Trigger the welcome email workflow
    await knockClient.notify("welcome", {
      data: {
        workspace: workspace?.name || "Default",
      },
      recipients: [`${user.id}`],
    })

    await knockClient.users.setWorkflowsPreferences(`${user.id}`, {
      "new-comment": {
        conditions: [
          {
            variable: "recipient.muted_projects",
            operator: "not_contains",
            argument: "data.projectId",
          },
        ],
      },
      "new-asset": {
        conditions: [
          {
            variable: "recipient.muted_projects",
            operator: "not_contains",
            argument: "data.projectId",
          },
        ],
      },
    })

    await ctx.session.$create({ userId: user.id, role: user.role as Role })

    return user
  }
})
