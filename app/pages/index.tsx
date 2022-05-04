import { useEffect, Suspense } from "react"
import { BlitzPage, useMutation, usePaginatedQuery } from "blitz"
import { useRouter, Routes } from "blitz"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getWorkspaces from "app/workspaces/queries/getWorkspaces"

import { Spinner } from "@chakra-ui/react"

const HomePage = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const [workspacesResponse] = usePaginatedQuery(getWorkspaces, { where: {} })

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (workspacesResponse?.workspaces) {
      const workspace = workspacesResponse.workspaces[0]
      const project = workspace?.projects[0]

      if (workspace && project) {
        router.push(Routes.ProjectPage({ slug: workspace.slug, projectId: project?.id }))
      } else {
        router.push("/")
      }
    }
  }, [])

  return <Spinner />
}

const Home: BlitzPage = () => {
  return (
    <Suspense fallback="Loading...">
      <HomePage />
    </Suspense>
  )
}

Home.suppressFirstRenderFlicker = true

export default Home
