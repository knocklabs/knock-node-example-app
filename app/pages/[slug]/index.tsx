import { Spinner } from "@chakra-ui/spinner"
import { useRouter, useParam, useQuery } from "blitz"
import { useEffect, Suspense } from "react"
import getWorkspace from "app/workspaces/queries/getWorkspace"

const WorkspacePageComponent = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const [workspace] = useQuery(getWorkspace, { slug })

  useEffect(() => {
    if (workspace?.projects) {
      const project = workspace.projects[0]
      router.push(`${slug}/${project.id}`)
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
