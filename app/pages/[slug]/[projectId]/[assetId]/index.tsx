import { BlitzPage, useRouter, useParam, useQuery } from "blitz"
import { Link, Routes } from "blitz"
import { Suspense } from "react"

import getAsset from "app/assets/queries/getAsset"
import CommentList from "app/comments/components/CommentList"

import Layout from "app/core/components/Layout"
import { AspectRatio, Box, Flex, Heading, Text } from "@chakra-ui/layout"
import { Image, Spinner } from "@chakra-ui/react"

const AssetPageComponent = () => {
  const router = useRouter()
  const id = useParam("assetId", "number")
  const slug = useParam("slug", "string")
  const [asset, { refetch }] = useQuery(getAsset, { id })

  const project = asset.project

  if (!project || !slug) {
    router.push("/")
    return <Spinner />
  }

  return (
    <Layout>
      <Flex flex={1}>
        <Box p={6} width="100%" height="100%" position="relative">
          <Link href={Routes.ProjectPage({ slug: slug, projectId: project.id })}>
            <a>&#8592; Back to {project.name}</a>
          </Link>

          <Heading size="lg" mt={3} mb={6}>
            {asset.name}
          </Heading>

          <AspectRatio width="90%" ratio={16 / 9}>
            <Image src={asset.url} objectFit="cover" alt="Image" />
          </AspectRatio>
        </Box>
        <Flex
          width="390px"
          flexShrink={0}
          ml="auto"
          flexDir="column"
          borderLeftWidth={1}
          borderLeftColor="gray.200"
          position="relative"
          height="calc(100vh - 48px)"
        >
          <Box borderBottomColor="gray.200" borderBottomWidth={1} p={4}>
            <Text fontSize="sm">
              <Text fontWeight="semibold" display="inline">
                {asset.author.name}
              </Text>{" "}
              uploaded this file
            </Text>

            <Heading size="xs" fontWeight="normal" mt={3}>
              {asset.comments.length} Comments
            </Heading>
          </Box>

          <CommentList asset={asset} project={project} slug={slug} refetch={refetch} />
        </Flex>
      </Flex>
    </Layout>
  )
}

const AssetPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <AssetPageComponent />
    </Suspense>
  )
}

export default AssetPage
