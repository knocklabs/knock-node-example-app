import { BlitzPage, useRouter, useParam, useQuery, useMutation, Link, Routes } from "blitz"
import { Suspense, useState } from "react"

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
import AddSlackComponent from "app/projects/components/AddSlackComponent"
import SlackChannelsComponent from "app/projects/components/SlackChannelsComponent"
import ConnectToSlackContainer from "app/projects/components/ConnectToSlackContainer"
import ConnectToSlackToggle from "app/projects/components/ConnectToSlackToggle"

const ProjectPageComponent = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const id = useParam("projectId", "number")
  const [project, { refetch }] = useQuery(getProject, { id })
  const { user } = useCurrentUser()
  const [isConnectedToSlack, setIsConnectedToSlack] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const addSlackComponent = <AddSlackComponent projectId={project.id} />

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
      <Flex flex={1} height="100%" width="100%" alignContent="space-between">
        <CreateAssetModal
          isOpen={isOpen}
          onClose={onClose}
          createAssetMutation={createAssetMutation}
          slug={slug}
          project={project}
        />
        <Flex direction="column" flexGrow={1} width="100%">
          <Flex alignContent="space-between" alignItems="baseline" width="100%">
            <Flex alignItems="center" p={6} flexGrow={1}>
              <Heading size="lg">{project.name}</Heading>
              <Button ml={4} onClick={onOpen}>
                Create asset
              </Button>
            </Flex>
          </Flex>
          <Flex flexWrap="wrap" mt={4}>
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
          <Flex ml={4}>
            <ConnectToSlackContainer actionButton={addSlackComponent} />
          </Flex>
        </Flex>
        <Flex direction="column" p={6}>
          <Flex mb={4}>
            {project.slackChannel ? (
              <Text ml="auto" fontWeight="bold">
                Connected to: {project.slackChannel}
              </Text>
            ) : (
              addSlackComponent
            )}
          </Flex>
          <Flex mb={4}>
            <ConnectToSlackToggle
              showLabel={true}
              isChecked={isConnectedToSlack}
              handleToggle={() => setIsConnectedToSlack((state) => !state)}
            />
          </Flex>
          <SlackChannelsComponent user={user} />
        </Flex>
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
