import { BlitzApiRequest, BlitzApiResponse, NotFoundError } from "blitz"
import db from "db"
import axios from "axios"
import { URLSearchParams } from "url"

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

      /*
      TODO: ADD KNOCK - SET OBJECT; SET CHANNEL DATA

      After the user has selected which channel in Slack the project will be connected to, we
      need to:
      1. set it as an object on Knock's side
      2. set channel data for the object (the incoming webhook url)
      */

      res.redirect(`/${project.workspace.slug}/${projectId}`).end()
    } else {
      return new NotFoundError()
    }
  }
}

export default handler
