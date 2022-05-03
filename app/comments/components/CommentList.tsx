import { useMutation } from "blitz"
import { Avatar } from "@chakra-ui/avatar"
import { Button } from "@chakra-ui/button"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { Textarea } from "@chakra-ui/textarea"
import { useRef, useState, useEffect } from "react"

import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import createComment from "app/comments/mutations/createComment"

const CommentList = ({ asset, project, slug, refetch }) => {
  const paneRef = useRef<HTMLDivElement>(null)
  const [commentText, setCommentText] = useState("")
  const user = useCurrentUser()

  const [createCommentMutation] = useMutation(createComment, {
    onSuccess: () => {
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
    <>
      <Box maxH="calc(100vh - 250px)" overflowY="auto" ref={paneRef}>
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

      <Flex
        backgroundColor="white"
        flexDir="column"
        borderTopColor="gray.200"
        borderTopWidth={1}
        mt="auto"
      >
        <form onSubmit={handleSendComment}>
          <Textarea
            size="xs"
            placeholder="Leave your comment"
            borderColor="transparent"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit" size="xs" ml="auto" mt={1}>
            Send
          </Button>
        </form>
      </Flex>
    </>
  )
}

export default CommentList
