import { useState, useEffect } from "react"

export interface Channel {
  name: string
  id: string
  connected: boolean
}

export const useSlackChannels = ({ tenantId, objectId, collection, knockClient }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{ channels: Channel[] }>({ channels: [] })

  const accessTokenObject = {
    objectId: tenantId,
    collection: "$tenants",
  }

  const connectionsObject = {
    objectId,
    collection,
  }

  useEffect(() => {
    knockClient.slack
      .getChannels({
        accessTokenObject,
        connectionsObject,
        knockChannelId: process.env.BLITZ_PUBLIC_KNOCK_SLACK_CHANNEL_ID!,
      })
      .then((res) => {
        const { channels } = res

        setData({ channels })
        setIsLoading(false)
      })
  }, [])

  return { data, isLoading, error: false }
}
