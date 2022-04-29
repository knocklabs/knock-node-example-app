import { BlitzPage, useRouter, useParam, useQuery, Link, Routes } from "blitz"
import { useEffect, Suspense } from "react"

import getWorkspace from "app/workspaces/queries/getWorkspace"

import Layout from "app/core/components/Layout"
import { Avatar } from "@chakra-ui/avatar"
import { Spinner } from "@chakra-ui/spinner"
import { Box, Flex, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/layout"

const WorkspacePageComponent = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const [workspace] = useQuery(getWorkspace, { slug })

  useEffect(() => {
    if (workspace) {
      // const project = workspace.projects[0]
      // router.push(`${slug}/${project?.id}`)
    } else {
      router.push("/")
    }
  }, [workspace, router])

  return (
    <Layout>
      <Flex flex={1} height="100%">
        <Box p={6} width="100%" position="relative">
          <Heading size="lg" mb={6}>
            {workspace.name} - Projects
          </Heading>

          <Box>
            {workspace.projects.map((project) => (
              <Link key={project.id} href={Routes.ProjectPage({ slug, projectId: project.id })}>
                <Flex
                  cursor="pointer"
                  flexDirection="column"
                  alignItems="center"
                  width="300px"
                  p={2}
                  borderWidth={1}
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <Heading size="md">{project.name}</Heading>
                  <Text>{project.description}</Text>
                  <Box mt={6}>
                    {project.members.map((member) => (
                      <Avatar key={member.id} name={member.user.name} size="sm" mr={2} />
                    ))}
                  </Box>
                </Flex>
              </Link>
            ))}
          </Box>
        </Box>
      </Flex>
    </Layout>
  )
}

const WorkspacePage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <WorkspacePageComponent />
    </Suspense>
  )
}

export default WorkspacePage
