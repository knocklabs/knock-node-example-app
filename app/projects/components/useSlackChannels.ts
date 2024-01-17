import Knock from "@knocklabs/client"
import { useState, useEffect, useMemo } from "react"

export interface Channel {
  name: string
  id: string
  connected: boolean
}

export const useSlackChannels = ({
  accessTokenObject,
  connectionsObject,
  host,
  knockClientId,
  userToken,
  user,
  refetch,
  setHasError,
  hasError,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{ channels: Channel[] }>({
    channels: [],
  })

  const knockClient = useMemo(() => {
    const knock = new Knock(knockClientId, {
      host: host,
    })
    knock.authenticate(user.id, userToken)

    return knock
  }, [host, knockClientId, user.id, userToken])

  useEffect(() => {
    if (!hasError) {
      const fetchChannels = async () => {
        try {
          await knockClient.slack
            .getChannels({
              accessTokenObject,
              connectionsObject,
              knockChannelId: process.env.BLITZ_PUBLIC_KNOCK_SLACK_CHANNEL_ID!,
            })
            .then((res) => {
              console.log(res)
              const { channels } = res
              setData({ channels })
              setIsLoading(false)
            })
        } catch (error) {
          console.error(error)
          setHasError(true)
        }
      }

      setIsLoading(true)
      fetchChannels()
    }
  }, [refetch])

  return { data, isLoading, error: false }
}
