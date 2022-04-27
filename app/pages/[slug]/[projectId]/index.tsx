import { BlitzPage, useRouter, useParam, useQuery, Link, Routes } from "blitz"
import { useEffect, Suspense } from "react"

import getProject from "app/projects/queries/getProject"

import { Avatar } from "@chakra-ui/avatar"
import { AspectRatio, Box, Flex, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/layout"
import { Image, Spinner } from "@chakra-ui/react"
import Layout from "app/core/components/Layout"

const ProjectPageComponent = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const id = useParam("projectId", "number")
  const [project, { setQueryData }] = useQuery(getProject, { id })

  return (
    <Layout>
      <Flex flex={1} height="100%">
        <Box p={6} width="100%" position="relative">
          <Heading size="lg" mb={6}>
            {project.name}
          </Heading>

          <Flex>
            {project.assets?.map((asset) => (
              <Box
                key={asset.id}
                width="300px"
                borderWidth={1}
                borderColor="gray.200"
                borderRadius="md"
                overflow="hidden"
              >
                <Link href={Routes.AssetPage({ slug, projectId: id, assetId: asset.id })}>
                  <a>
                    <AspectRatio width="100%" ratio={16 / 9}>
                      <Image src={asset.url} objectFit="cover" alt="Image" />
                    </AspectRatio>
                    <Box p={3}>
                      <Text fontWeight="semibold">{asset.name}</Text>
                      <Text fontWeight="normal" color="gray.600">
                        {asset.author.name}
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
            ))}
          </Flex>
        </Box>
        <Flex
          width="390px"
          flexShrink={0}
          ml="auto"
          flexDir="column"
          borderLeftWidth={1}
          borderLeftColor="gray.200"
          position="relative"
          height="100%"
        >
          <Box borderBottomColor="gray.200" borderBottomWidth={1} p={4}>
            <Heading size="xs" fontWeight="regular" mt={3} mb={4}>
              {project.members?.length} Project members
            </Heading>

            <UnorderedList listStyleType="none" m={0} p={0}>
              {project.members?.map((member) => (
                <ListItem key={member.id} display="flex" alignItems="center" m={0} p={0} mb={2}>
                  <Avatar name={member.user.name} size="sm" mr={2} />
                  <Text fontSize="sm" fontWeight="semibold">
                    {member.user.name}
                  </Text>
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  )
}

const ProjectPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ProjectPageComponent />
    </Suspense>
  )
}

export default ProjectPage
