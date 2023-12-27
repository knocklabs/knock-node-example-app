import Knock from "@knocklabs/client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Channel, useSlackChannels } from "./useSlackChannels"

type SlackChannel = {
  name: string
  connected: boolean
  id: string
}

const SlackChannelsComponent = ({
  tenantId = "tenant12345",
  user,
  objectId = "slack_chann_test",
  collection = "projects2",
}) => {
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([])
  const userToken = localStorage.getItem(`x-knock-user-token`)

  const knockClient = useMemo(() => {
    const knock = new Knock(process.env.BLITZ_PUBLIC_KNOCK_CLIENT_ID!, {
      host: process.env.BLITZ_PUBLIC_KNOCK_API_URL,
    })
    knock.authenticate(user.id, userToken)

    return knock
  }, [user.id, userToken])

  const { data, isLoading, error } = useSlackChannels({
    tenantId,
    objectId,
    collection,
    knockClient,
  })
  const { channels } = data

  const handleCheckboxChange = (channelId: string) => {
    const channelToUpdate = channels.find((ch) => ch.id === channelId)
    if (channelToUpdate) {
      const updatedChannels = channels.map((ch) =>
        ch.id === channelId ? { ...ch, connected: !ch.connected } : ch
      )
      setSelectedChannels(updatedChannels)

      const channelsToSendToKnock = updatedChannels
        .filter((channel) => channel.connected)
        .map((channel) => {
          return {
            channel_id: channel.id,
            access_token: process.env.BLITZ_PUBLIC_TENANT_ACCESS_TOKEN_TEMP!,
          }
        })

      knockClient.slack.setChannelConnections({
        objectId,
        collection,
        knockChannelId: process.env.BLITZ_PUBLIC_KNOCK_SLACK_CHANNEL_ID!,
        slackChannelId: channelId,
        connections: channelsToSendToKnock,
        userId: user.id,
      })
    }
  }

  return (
    <div
      style={{
        padding: "30px",
        width: "200px",
      }}
    >
      <div>
        {isLoading ? (
          <div>
            <text>Loading channels...</text>
          </div>
        ) : (
          channels.map((channel) => {
            return (
              <div
                className="flex-row"
                key={channel["id"]}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  padding: "4px",
                }}
              >
                <div className="flex-item" style={{ width: "80px" }}>
                  <label htmlFor={channel["id"]}>{channel["name"]}</label>
                </div>
                <div
                  className="flex-item"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    id={channel.id}
                    name={channel.name}
                    value={channel.name}
                    checked={channel.connected}
                    onChange={() => handleCheckboxChange(channel.id)}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SlackChannelsComponent
