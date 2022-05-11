import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = () => {
  const [user, { refetch: refetchUser }] = useQuery(getCurrentUser, null)
  return { user, refetchUser }
}
