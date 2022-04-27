import { BlitzPage, useRouter, useParam, useQuery } from "blitz"
import { useEffect, Suspense } from "react"

import getWorkspace from "app/workspaces/queries/getWorkspace"

import { Spinner } from "@chakra-ui/spinner"

const WorkspacePageComponent = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const [workspace] = useQuery(getWorkspace, { slug })

  useEffect(() => {
    if (workspace?.projects && slug) {
      const project = workspace.projects[0]
      router.push(`${slug}/${project?.id}`)
    } else {
      router.push("/")
    }
  }, [workspace, router])

  return <Spinner />
}

const WorkspacePage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <WorkspacePageComponent />
    </Suspense>
  )
}

export default WorkspacePage
