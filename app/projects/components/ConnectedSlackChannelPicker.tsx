import Knock from "@knocklabs/client"
import { useMemo, useState } from "react"
import { Channel, useSlackChannels } from "./useSlackChannels"
import styles from "./ConnectedSlackChannelPicker.module.css"

interface Option {
  label: string
  value: any
}

interface MultiSelectAccordionProps {
  options: Option[]
  onClick: (option: Option) => void
}

const ConnectedSlackChannelPicker = ({
  user,
  accessTokenObject,
  connectionsObject,
  knockClientId,
  host,
  userToken,
}) => {
  const knockClient = useMemo(() => {
    const knock = new Knock(knockClientId, {
      host: host,
    })
    knock.authenticate(user.id, userToken)

    return knock
  }, [host, knockClientId, user.id, userToken])

  const [toggleForRefetch, setToggleForRefetch] = useState(false)
  const [isSettingChannels, setIsSettingChannels] = useState(false)
  const [showChannelPicker, setShowChannelPicker] = useState(false)
  const [hasError, setHasError] = useState(false)

  const {
    data,
    isLoading: isLoadingSlackChannels,
    error,
  } = useSlackChannels({
    accessTokenObject,
    connectionsObject,
    knockClientId,
    userToken,
    user,
    host,
    refetch: toggleForRefetch,
    setHasError,
    hasError,
  })

  const isLoading = isSettingChannels || isLoadingSlackChannels

  const { channels } = data

  const handleOptionClick = async (channelId: string) => {
    setIsSettingChannels(true)
    const channelToUpdate = channels.find((ch) => ch.id === channelId)
    if (channelToUpdate) {
      const updatedChannels = channels.map((ch) =>
        ch.id === channelId ? { ...ch, connected: !ch.connected } : ch
      )

      const channelsToSendToKnock = updatedChannels
        .filter((channel) => channel.connected)
        .map((channel) => {
          return {
            channel_id: channel.id,
            access_token: process.env.BLITZ_PUBLIC_TENANT_ACCESS_TOKEN_TEMP!,
          }
        })

      try {
        await knockClient.slack.setChannelConnections({
          objectId: connectionsObject.objectId,
          collection: connectionsObject.collection,
          knockChannelId: process.env.BLITZ_PUBLIC_KNOCK_SLACK_CHANNEL_ID!,
          slackChannelId: channelId,
          connections: channelsToSendToKnock,
          userId: user.id,
        })
        setToggleForRefetch((state) => !state)
      } catch (error) {
        setHasError(true)
        setShowChannelPicker(false)
      }
      setIsSettingChannels(false)
    }
  }

  const channelsConnectedMessage = () => {
    if (hasError) {
      return "Error fetching channels"
    }

    if (isLoading) {
      return "Loading..."
    }

    const numberConnectedChannels = channels.filter((channel) => channel.connected).length

    if (numberConnectedChannels === 0) {
      return "Select a Slack channel"
    }

    if (numberConnectedChannels === 1) {
      const connectedChannel = channels.find((channel) => channel.connected) as Channel
      return `#${connectedChannel.name}`
    }

    return "Multiple channels connected"
  }
  return (
    <div
      style={{
        width: "256px",
      }}
    >
      <div>
        <div className={styles.multiSelectAccordion}>
          <div
            key={"select"}
            className={styles.header}
            onClick={() => {
              if (!hasError) {
                setShowChannelPicker(!showChannelPicker)
              }
            }}
          >
            {channelsConnectedMessage()}
            {!hasError && (
              <span className={styles.icon}>
                {showChannelPicker ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 512 512"
                  >
                    <g transform="translate(0 512) scale(1 -1)">
                      <path
                        fill="none"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="48"
                        d="m112 184l144 144l144-144"
                      />
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="none"
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="48"
                      d="m112 184l144 144l144-144"
                    />
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>
        {!!showChannelPicker && (
          <div className={styles.multiSelectAccordion}>
            <div className={styles.optionsContainer}>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`${styles.option} ${channel.connected ? styles.selected : ""} ${
                    isLoading && styles.disabled
                  }`}
                  onClick={() => !isLoading && handleOptionClick(channel.id)}
                >
                  #{channel.name}{" "}
                  <span className={styles.icon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="13"
                      viewBox="0 0 12 13"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.99041 3.0056C6.01365 2.85109 5.9757 2.6936 5.88462 2.56664C5.79355 2.43968 5.65654 2.35325 5.50273 2.32574C5.34892 2.29823 5.19044 2.3318 5.061 2.41933C4.93157 2.50685 4.84137 2.64141 4.80961 2.7944L4.46881 4.7H2.40001C2.24088 4.7 2.08827 4.76321 1.97575 4.87573C1.86323 4.98826 1.80001 5.14087 1.80001 5.3C1.80001 5.45913 1.86323 5.61174 1.97575 5.72426C2.08827 5.83678 2.24088 5.9 2.40001 5.9H4.25461L3.77281 8.6H1.80001C1.64088 8.6 1.48827 8.66321 1.37575 8.77573C1.26323 8.88826 1.20001 9.04087 1.20001 9.2C1.20001 9.35913 1.26323 9.51174 1.37575 9.62426C1.48827 9.73678 1.64088 9.8 1.80001 9.8H3.55801L3.30961 11.1944C3.28637 11.3489 3.32433 11.5064 3.4154 11.6334C3.50648 11.7603 3.64349 11.8467 3.7973 11.8743C3.95111 11.9018 4.10958 11.8682 4.23902 11.7807C4.36846 11.6931 4.45865 11.5586 4.49041 11.4056L4.77721 9.8H6.40861L6.15961 11.1944C6.14331 11.2729 6.14291 11.3539 6.15845 11.4326C6.17398 11.5113 6.20513 11.586 6.25004 11.6524C6.29496 11.7189 6.35274 11.7756 6.41997 11.8194C6.4872 11.8631 6.5625 11.8929 6.64144 11.907C6.72038 11.9211 6.80135 11.9193 6.87957 11.9016C6.95778 11.8839 7.03165 11.8506 7.09681 11.8039C7.16197 11.7572 7.2171 11.6978 7.25894 11.6294C7.30078 11.561 7.32849 11.4849 7.34041 11.4056L7.62721 9.8H9.60001C9.75914 9.8 9.91176 9.73678 10.0243 9.62426C10.1368 9.51174 10.2 9.35913 10.2 9.2C10.2 9.04087 10.1368 8.88826 10.0243 8.77573C9.91176 8.66321 9.75914 8.6 9.60001 8.6H7.84201L8.32381 5.9H10.2C10.3591 5.9 10.5118 5.83678 10.6243 5.72426C10.7368 5.61174 10.8 5.45913 10.8 5.3C10.8 5.14087 10.7368 4.98826 10.6243 4.87573C10.5118 4.76321 10.3591 4.7 10.2 4.7H8.53801L8.84041 3.0056C8.85671 2.92708 8.85711 2.84609 8.84158 2.76742C8.82605 2.68874 8.7949 2.61398 8.74998 2.54755C8.70506 2.48112 8.64728 2.42436 8.58006 2.38064C8.51283 2.33692 8.43752 2.30712 8.35858 2.293C8.27964 2.27888 8.19867 2.28073 8.12046 2.29844C8.04224 2.31615 7.96837 2.34935 7.90321 2.39609C7.83805 2.44284 7.78292 2.50217 7.74108 2.57058C7.69924 2.63899 7.67154 2.7151 7.65961 2.7944L7.31881 4.7H5.68801L5.99041 3.0056ZM6.62281 8.6L7.10401 5.9H5.47381L4.99141 8.6H6.62281Z"
                        fill="#9EA0AA"
                      />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectedSlackChannelPicker
