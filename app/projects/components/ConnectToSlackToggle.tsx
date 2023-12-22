import { Switch } from "@chakra-ui/react"
import styles from "./ConnectToSlackToggle.module.css"

const ConnectToSlackToggle = ({
  showLabel,
  isChecked,
  handleToggle,
}: {
  showLabel: boolean
  isChecked: boolean
  handleToggle: () => void
}) => {
  return (
    <div className={styles.container}>
      {showLabel && (
        <div>
          <div className={styles.connectContainer}>
            <span className={`${styles.connect} ${isChecked && styles.connected}`}>Connected</span>
          </div>
          <span className={styles.text}> to Slack</span>
        </div>
      )}
      <Switch size="md" isChecked={isChecked} onChange={handleToggle} />
    </div>
  )
}

export default ConnectToSlackToggle
