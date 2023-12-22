import SlackIcon from "./SlackIcon"
import styles from "./ConnectToSlackContainer.module.css"

const ConnectToSlackContainer = ({ actionButton }: { actionButton: React.ReactElement }) => {
  return (
    <div className={styles.container}>
      <div>
        <SlackIcon height="32px" width="32px" />
        <div className={styles.title}>Slack</div>
        <div className={styles.description}>
          Connect to get notifications in your Slack workspace.
        </div>
      </div>
      <div>{actionButton}</div>
    </div>
  )
}

export default ConnectToSlackContainer
