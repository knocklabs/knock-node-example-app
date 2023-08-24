import { BlitzPage, useRouter, useParam, useQuery, useMutation, Link, Routes } from "blitz"
import { Suspense } from "react"

import Layout from "app/core/components/Layout"
import AddSlackBtn from "app/projects/components/AddSlackBtn"
import getProject from "app/projects/queries/getProject"
import toggleMuted from "app/projects/mutations/toggleMuted"
import createAsset from "app/assets/mutations/createAsset"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

import { Avatar } from "@chakra-ui/avatar"
import { AspectRatio, Box, Flex, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/layout"
import { Switch, Image, Button, useDisclosure, useToast } from "@chakra-ui/react"
import CreateAssetModal from "app/projects/components/CreateAssetModal"
import FallbackSpinner from "app/core/components/FallbackSpinner"

const ProjectPageComponent = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const id = useParam("projectId", "number")
  const [project, { refetch }] = useQuery(getProject, { id })
  const { user } = useCurrentUser()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [createAssetMutation] = useMutation(createAsset, {
    onSuccess: (result) => {
      if ("notify" in result && !result?.notify?.success) {
        toast({
          status: "error",
          title: "Notification failed",
          description: `Make sure you have a workflow called ${result?.notify?.workflow} in Knock.`,
        })
      }
      refetch()
    },
  })
  const [toggleMutedMutation] = useMutation(toggleMuted)

  if (!slug || !project || !user) {
    router.push("/")
    return <FallbackSpinner />
  }

  const userProjectMembership = project.members.find((m) => m.userId === user.id)

  return (
    <Layout>
      <Flex flex={1} height="100%">
        <CreateAssetModal
          isOpen={isOpen}
          onClose={onClose}
          createAssetMutation={createAssetMutation}
          slug={slug}
          project={project}
        />
        <Box p={6} width="calc(100% - 400px)" position="relative">
          <Flex alignItems="center" mb={6}>
            <Heading size="lg">{project.name}</Heading>
            <Button ml={4} onClick={onOpen}>
              Create asset
            </Button>
            {project.slackChannel ? (
              <Text ml="auto" fontWeight="bold">
                Connected to: {project.slackChannel}
              </Text>
            ) : (
              <AddSlackBtn projectId={project.id} />
            )}
          </Flex>

          <Flex flexWrap={"wrap"}>
            {project.assets?.map((asset) => (
              <Box
                key={asset.id}
                width="300px"
                borderWidth={1}
                borderColor="gray.200"
                borderRadius="md"
                overflow="hidden"
                ml={4}
                mb={4}
              >
                <Link href={Routes.AssetPage({ slug, projectId: project.id, assetId: asset.id })}>
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
          width="400px"
          flexDir="column"
          borderLeftWidth={1}
          borderLeftColor="gray.200"
          height="100%"
        >
          <Box p={4}>
            <Heading size="xs" mb={4}>
              Preferences
            </Heading>
            <Flex>
              <Switch
                id="email-alerts"
                size="lg"
                isChecked={userProjectMembership?.muted}
                onChange={async () => {
                  await toggleMutedMutation({ projectId: project.id })
                  await refetch()
                }}
              />
              <Text ml={3}>Muted</Text>
            </Flex>
          </Box>
          <Box borderBottomColor="gray.200" borderBottomWidth={1} p={4}>
            <Heading size="xs" fontWeight="regular" mt={3} mb={4}>
              {project.members?.length} Project members
            </Heading>

            <UnorderedList listStyleType="none" m={0} p={0}>
              {project.members?.map((member) => (
                <ListItem key={member.id} display="flex" alignItems="center" m={0} p={0} mb={2}>
                  {member.user.name && <Avatar name={member.user.name} size="sm" mr={2} />}
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
    <Suspense fallback={<FallbackSpinner />}>
      <ProjectPageComponent />
    </Suspense>
  )
}

export default ProjectPage
