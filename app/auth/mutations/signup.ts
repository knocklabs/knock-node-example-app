import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"
import { Knock } from "@knocklabs/node"
import { NEW_ASSET, NEW_COMMENT, WELCOME } from "app/lib/workflows"

const knockClient = new Knock(process.env.KNOCK_API_KEY, {
  host: "https://046a-135-84-167-61.ngrok-free.app",
})

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

    // Identify user on Knock so we the data is accessible when triggering workflows
    await knockClient.users.identify(`${user.id}`, { email: user.email, name: user.name })

    const notify = { success: false }

    // Trigger the welcome email workflow
    try {
      await knockClient.notify(WELCOME, {
        data: {
          workspace: workspace?.name || "Default",
        },
        recipients: [`${user.id}`],
      })
      notify.success = true
    } catch (error) {
      console.error("Welcome notification error:", error)
    }

    try {
      await knockClient.users.setWorkflowsPreferences(`${user.id}`, {
        [NEW_COMMENT]: {
          conditions: [
            {
              variable: "recipient.muted_projects",
              operator: "not_contains",
              argument: "data.projectId",
            },
          ],
        },
        [NEW_ASSET]: {
          conditions: [
            {
              variable: "recipient.muted_projects",
              operator: "not_contains",
              argument: "data.projectId",
            },
          ],
        },
      })
    } catch (error) {
      notify.success = false
      console.error("Error setting preferences:", error)
    }

    await ctx.session.$create({ userId: user.id, role: user.role as Role })

    return { user, notify }
  }
})
