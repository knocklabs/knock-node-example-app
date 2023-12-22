import SlackIcon from "./SlackIcon"
import styles from "./AddSlackComponent.module.css"

const SLACK_AUTHORIZE_URL = "https://slack.com/oauth/v2/authorize"

const AddSlackComponent = ({ projectId, tenantId = "tenant12345" }) => {
  const params1 = {
    state: JSON.stringify({
      redirect_url: "http://localhost:3001/ingen/1",
      project_id: projectId,
      tenant_id: tenantId,
      channel_id: process.env.BLITZ_PUBLIC_KNOCK_SLACK_CHANNEL_ID,
      public_key: process.env.BLITZ_PUBLIC_KNOCK_CLIENT_ID,
      user_token: process.env.BLITZ_PUBLIC_USER_TOKEN,
    }),
    client_id: process.env.BLITZ_PUBLIC_SLACK_CLIENT_ID,
    scope: "chat:write,chat:write.public,channels:read",
  } as Record<string, string>
  const params = new URLSearchParams(params1)

  return (
    <a href={`${SLACK_AUTHORIZE_URL}?${params}`} className={styles.linkA}>
      <SlackIcon height="16px" width="16px" />
      <span className={styles.textContainer}>Connect to Slack</span>
    </a>
  )
}

export default AddSlackComponent
