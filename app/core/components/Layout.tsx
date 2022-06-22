import { useRef } from "react"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { useMutation, useRouter } from "blitz"
import { FiLogOut } from "react-icons/fi"

import { Avatar, Button, Icon, useDisclosure } from "@chakra-ui/react"
import { Input } from "@chakra-ui/input"

import {
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react-notification-feed"

import "@knocklabs/react-notification-feed/dist/index.css"

import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import NotificationPreferencesModal from "app/users/components/NotificationPreferencesModal"
import logout from "app/auth/mutations/logout"

type Props = {
  children?: React.ReactElement
}

const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const { slug } = router.query
  const { user, refetchUser } = useCurrentUser()
  const { isOpen: isFeedOpen, onOpen: onOpenFeed, onClose: onCloseFeed } = useDisclosure()
  const {
    isOpen: isSettingsModalOpen,
    onOpen: onOpenSettingsModal,
    onClose: onCloseSettingsModal,
  } = useDisclosure()
  const [logoutMutation] = useMutation(logout)

  const notifButtonRef = useRef(null)

  if (!user) {
    return null
  }

  return (
    <>
      <Flex flexDirection="column" width="100vw" height="100vh">
        <Flex
          as="header"
          alignItems="center"
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
          <Box ml="auto">
            <KnockFeedProvider
              apiKey={process.env.BLITZ_PUBLIC_KNOCK_CLIENT_ID!}
              feedId={process.env.BLITZ_PUBLIC_KNOCK_FEED_ID!}
              userId={`${user.id}`}
            >
              <Box ml="auto">
                <NotificationIconButton ref={notifButtonRef} onClick={onOpenFeed} />
                <NotificationFeedPopover
                  buttonRef={notifButtonRef}
                  isVisible={isFeedOpen}
                  onClose={onCloseFeed}
                />
              </Box>
            </KnockFeedProvider>
          </Box>
          {user?.name ? (
            <Avatar cursor="pointer" size="xs" name={user.name} onClick={onOpenSettingsModal} />
          ) : (
            ""
          )}
          {user?.name ? (
            <Button
              marginLeft="2"
              size="sm"
              variant="outline"
              colorScheme="orange"
              leftIcon={<Icon as={FiLogOut} />}
              onClick={() => logoutMutation()}
            >
              Logout
            </Button>
          ) : (
            ""
          )}
        </Flex>
        <Box flex={1} width="100%">
          {children}
        </Box>
      </Flex>
      <NotificationPreferencesModal
        user={user}
        isOpen={isSettingsModalOpen}
        onClose={onCloseSettingsModal}
      />
    </>
  )
}

export default Layout
