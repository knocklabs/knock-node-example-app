import { useMutation } from "blitz"
import { Avatar } from "@chakra-ui/avatar"
import { Button } from "@chakra-ui/button"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { Textarea } from "@chakra-ui/textarea"
import { useRef, useState, useEffect } from "react"

import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import createComment from "app/comments/mutations/createComment"
import * as analytics from "app/lib/analytics"
import { useToast } from "@chakra-ui/react"

const CommentList = ({ asset, project, slug, refetch }) => {
  const paneRef = useRef<HTMLDivElement>(null)
  const [commentText, setCommentText] = useState("")
  const { user } = useCurrentUser()
  const toast = useToast()

  const [createCommentMutation] = useMutation(createComment, {
    onSuccess: (result) => {
      if (typeof window !== "undefined" && analytics.ENABLE_SEGMENT) {
        analytics.track("comment-created", {
          author: user,
          text: result?.comment?.text,
          createdAt: result?.comment?.createdAt,
          id: result?.comment?.id,
          assetId: result?.comment?.assetId,
        })
      }

      if (!result?.notify?.success) {
        toast({
          status: "error",
          title: "Notification failed",
          description: `Make sure you have a workflow called ${result?.notify?.workflow} in Knock.`,
        })
      }

      refetch()
    },
  })

  const handleSendComment = async (e) => {
    e.preventDefault()

    const attrs = {
      text: commentText,
      assetId: asset.id,
      projectId: project.id,
      workspaceSlug: slug,
    }

    createCommentMutation(attrs)

    setCommentText("")
  }

  useEffect(() => {
    if (asset.comments.length) {
      const comment = asset.comments[asset.comments.length - 1]
      const paneElement: HTMLDivElement | null = paneRef?.current

      if (paneElement) {
        const item = paneElement.querySelector(`[data-id='${comment.id}']`)

        if (item) item.scrollIntoView()
      }
    }
  }, [asset.comments])

  return (
    <Flex
      flexDir="column"
      height="100%"
      justifyContent="space-between"
      maxHeight={"calc(100vh - 170px)"}
      overflow="hidden"
    >
      <Box overflowY="auto" ref={paneRef} flexGrow={1}>
        {asset.comments.map((comment) => (
          <Box
            data-id={comment.id}
            key={comment.id}
            borderBottomColor="gray.200"
            borderBottomWidth={1}
            p={4}
          >
            <Flex alignItems="center" mb={2}>
              <Avatar name={comment.author.name} size="xs" mr={2} />
              <Text fontSize="sm" fontWeight="semibold">
                {comment.author.name}
              </Text>
            </Flex>
            <Text fontSize="sm">{comment.text}</Text>
          </Box>
        ))}
      </Box>

      <form onSubmit={handleSendComment}>
        <Flex backgroundColor="white" flexDir="column">
          <Textarea
            size="xs"
            placeholder="Leave your comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Flex justifyContent="flex-end" mr={2} my={2}>
            <Button type="submit" size="xs">
              Send
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  )
}

export default CommentList
