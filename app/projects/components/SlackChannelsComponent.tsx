import Knock from "@knocklabs/client"
import { useCallback, useEffect, useMemo, useState } from "react"

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
  const [channels, setChannels] = useState<SlackChannel[]>([])
  const knockClient = useMemo(() => {
    const knock = new Knock(process.env.BLITZ_PUBLIC_KNOCK_CLIENT_ID!, {
      host: "https://046a-135-84-167-61.ngrok-free.app",
    })
    knock.authenticate(user.id, user.access_token)

    return knock
  }, [user.id, user.access_token])

  const getChannels = useCallback(() => {
    knockClient.slack
      .getChannels({
        tenantId,
        objectId,
        collection,
        knockChannelId: process.env.BLITZ_PUBLIC_KNOCK_SLACK_CHANNEL_ID!,
      })
      .then((resp) => JSON.parse(resp))
      .then((res) => {
        console.log("result channels", res)

        setChannels(res)
      })
  }, [collection, knockClient.slack, objectId, tenantId])

  const handleCheckboxChange = (channelId: string) => {
    const channelToUpdate = channels.find((ch) => ch.id === channelId)
    if (channelToUpdate) {
      const updatedChannels = channels.map((ch) =>
        ch.id === channelId ? { ...ch, connected: !ch.connected } : ch
      )
      setChannels(updatedChannels)

      const channelsToSendToKnock = updatedChannels
        .filter((channel) => channel.connected)
        .map((channel) => {
          return {
            channel_id: channel.id,
            access_token: process.env.BLITZ_PUBLIC_TENANT_ACCESS_TOKEN_TEMP!,
          }
        })

      knockClient.slack
        .setChannelConnections({
          objectId,
          collection,
          knockChannelId: process.env.BLITZ_PUBLIC_KNOCK_SLACK_CHANNEL_ID!,
          slackChannelId: channelId,
          connections: channelsToSendToKnock,
          userId: user.id,
        })
        .then((res) => {
          console.log("result channels", res)
        })
      // .then((resp) => JSON.parse(resp))
    }
  }

  console.log("CHANNELS SET RESULT", channels)

  return (
    <div
      style={{
        padding: "30px",
        borderWidth: "4px",
        borderColor: "black",
        borderRadius: "8px",
        width: "200px",
      }}
    >
      <header style={{ fontWeight: "900", marginBottom: "8px" }}>Channels</header>
      <div>
        <button
          onClick={getChannels}
          style={{
            borderRadius: "8px",
            background: "orange",
            padding: "4px",
            cursor: "pointer",
          }}
        >
          Get channels
        </button>
        {channels.map((channel) => {
          return (
            <div
              className="flex-row"
              key={channel["id"]}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div className="flex-item" style={{ width: "80px" }}>
                <label htmlFor={channel["id"]}>
                  {channel["name"]} - {channel["id"]}
                </label>
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
        })}
      </div>
    </div>
  )
}

export default SlackChannelsComponent
