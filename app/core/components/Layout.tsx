import { Box, Flex, Text } from "@chakra-ui/layout"
import { Spinner, Avatar } from "@chakra-ui/react"
import { useRouter } from "blitz"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

type Props = {
  children?: React.ReactElement
}

const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const { slug } = router.query
  const user = useCurrentUser()

  return (
    <Flex flexDirection="column" width="100vw" height="100vh">
      <Flex
        as="header"
        backgroundColor="gray.50"
        borderBottomColor="gray.200"
        borderBottomWidth={1}
        px={6}
        py={3}
      >
        <Text
          textTransform="uppercase"
          letterSpacing={2}
          fontSize={16}
          color="blue.500"
          fontWeight={600}
        >
          Collab
        </Text>
        {user?.name ? <Avatar ml="auto" size="xs" name={user.name} /> : ""}
      </Flex>
      <Box flex={1} width="100%">
        {children}
      </Box>
    </Flex>
  )
}

export default Layout
