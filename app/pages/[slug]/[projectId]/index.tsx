import { BlitzPage, useRouter, useParam, useQuery, useMutation, Link, Routes } from "blitz"
import { useEffect, useState, useRef, Suspense } from "react"

import Layout from "app/core/components/Layout"
import AddSlackBtn from "app/projects/components/AddSlackBtn"
import getProject from "app/projects/queries/getProject"
import toggleMuted from "app/projects/mutations/toggleMuted"
import createAsset from "app/assets/mutations/createAsset"
import { Form } from "app/core/components/Form"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

import { Avatar } from "@chakra-ui/avatar"
import { AspectRatio, Box, Flex, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/layout"
import {
  Switch,
  Image,
  Spinner,
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { Input } from "@chakra-ui/input"
import { Field } from "formik"

const ProjectPageComponent = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const id = useParam("projectId", "number")
  const [project, { refetch }] = useQuery(getProject, { id })
  const { user } = useCurrentUser()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [createAssetMutation] = useMutation(createAsset, {
    onSuccess: () => {
      refetch()
    },
  })
  const [toggleMutedMutation] = useMutation(toggleMuted)

  if (!slug || !project || !user) {
    router.push("/")
    return <Spinner />
  }

  const userProjectMembership = project.members.find((m) => m.userId === user.id)

  return (
    <Layout>
      <>
        <Flex flex={1} height="100%">
          <Box p={6} width="calc(100% - 390px)" position="relative">
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

            <Flex>
              {project.assets?.map((asset) => (
                <Box
                  key={asset.id}
                  width="300px"
                  borderWidth={1}
                  borderColor="gray.200"
                  borderRadius="md"
                  overflow="hidden"
                  ml={4}
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
            width="390px"
            flexShrink={0}
            ml="auto"
            flexDir="column"
            borderLeftWidth={1}
            borderLeftColor="gray.200"
            position="relative"
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
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent overflow="hidden">
            <ModalHeader
              border="none"
              fontSize="18px"
              fontWeight="500"
              p={5}
              borderColor="black"
              borderBottomWidth={1}
            >
              Create asset
              <Text fontSize="14px" fontWeight="500" pr={3}>
                Project members will be able to comment on your asset.
              </Text>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody p={5}>
              <Box background="beige.100">
                <Form
                  initialValues={{ name: "", description: "", url: "" }}
                  onSubmit={async (values) => {
                    await createAssetMutation({
                      workspaceSlug: slug,
                      projectId: project.id,
                      ...values,
                    })
                    onClose()
                  }}
                >
                  <FormControl>
                    <Text
                      as="label"
                      textStyle="formLabel"
                      fontWeight="500"
                      color="gray.900"
                      fontSize="14px"
                    >
                      Name
                    </Text>
                    <Field name="name">
                      {({ field }) => <Input placeholder="Project Name" {...field} />}
                    </Field>
                  </FormControl>
                  <FormControl mt={4}>
                    <Text
                      as="label"
                      textStyle="formLabel"
                      fontWeight="500"
                      color="gray.900"
                      fontSize="14px"
                      mr={2}
                    >
                      Description
                    </Text>
                    <Field name="description">
                      {({ field }) => <Input placeholder="Description" {...field} />}
                    </Field>
                  </FormControl>
                  <FormControl mt={4}>
                    <Text
                      as="label"
                      textStyle="formLabel"
                      fontWeight="500"
                      color="gray.900"
                      fontSize="14px"
                      mr={2}
                    >
                      Image URL
                    </Text>
                    <Field name="url">
                      {({ field }) => <Input placeholder="http://example.com/image" {...field} />}
                    </Field>
                  </FormControl>
                  <ModalFooter mt={8} pr={0}>
                    <Button
                      variant="outline"
                      size="sm"
                      colorScheme="white"
                      color="gray.700"
                      fontWeight="500"
                      borderColor="#DDDEE1"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button fontWeight="500" size="sm" colorScheme="blue" type="submit" ml={2}>
                      Save
                    </Button>
                  </ModalFooter>
                </Form>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
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
