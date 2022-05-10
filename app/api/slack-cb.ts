import { BlitzApiRequest, BlitzApiResponse, NotFoundError } from "blitz"
import db from "db"
import axios from "axios"
import { URLSearchParams } from "url"
import { Knock } from "@knocklabs/node"

const knockClient = new Knock(process.env.KNOCK_API_KEY)

const SLACK_ACCESS_ENDPOINT = "https://slack.com/api/oauth.v2.access"

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const { code, state } = req.query
  const { projectId } = JSON.parse(state as string)

  const params = new URLSearchParams({
    client_id: process.env.BLITZ_PUBLIC_SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    redirect_uri: process.env.BLITZ_PUBLIC_SLACK_REDIRECT_URI,
    code,
  } as Record<string, string>)
  const accessTokenResponse = await axios.request({
    method: "POST",
    url: SLACK_ACCESS_ENDPOINT,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: params.toString(),
  })

  if (accessTokenResponse.data.ok) {
    const { url, channel } = accessTokenResponse.data.incoming_webhook

    const project = await db.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        workspace: true,
      },
    })

    if (project) {
      await db.project.update({
        where: { id: project.id },
        data: {
          slackChannel: channel,
        },
      })

      // After the user has selected which channel in Slack the project will be connected to, we set
      // it as an object on Knock's side
      await knockClient.objects.set("projects", `${project.id}`, {
        name: project.name,
      })

      // Once the the object is present on Knock we set the incoming webhook url on its channel
      // data for the Slack channel in Knock.
      // Now that the project is mapped to an object in Knock we can trigger workflows and add it
      // as a recipient. When the workflow reaches a Slack step and the object is a recipient, Knock
      // will use the object's channel data to send the notification to the connected Slack channel.
      await knockClient.objects.setChannelData(
        "projects",
        `${project.id}`,
        process.env.KNOCK_SLACK_CHANNEL_ID!,
        {
          connections: [
            {
              incoming_webhook: { url },
            },
          ],
        }
      )

      res.redirect(`/${project.workspace.slug}/${projectId}`).end()
    } else {
      return new NotFoundError()
    }
  }
}

export default handler
