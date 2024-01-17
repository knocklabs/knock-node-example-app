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
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        {showLabel && (
          <>
            <div className={styles.connectContainer}>
              <span
                aria-label={isChecked ? "Connected" : "Connect"}
                className={`${styles.connect} ${isChecked && styles.connected}`}
              >
                Connected
              </span>
            </div>
            <span> to Slack</span>
          </>
        )}
        <span className={styles.toggleContainer}>
          <Switch size="md" isChecked={isChecked} onChange={handleToggle} />
        </span>
      </div>
    </div>
  )
}

export default ConnectToSlackToggle
