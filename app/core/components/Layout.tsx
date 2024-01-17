import { useRef } from "react"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { useMutation } from "blitz"
import { FiLogOut } from "react-icons/fi"

import { Avatar, Button, Icon, IconButton, useDisclosure } from "@chakra-ui/react"
import { SettingsIcon } from "@chakra-ui/icons"

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
  const { user } = useCurrentUser()
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
    <Flex flexDirection="column" height="100%">
      {/* <NotificationPreferencesModal
        user={user}
        isOpen={isSettingsModalOpen}
        onClose={onCloseSettingsModal}
      /> */}
      <Flex
        as="header"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="gray.50"
        borderBottomColor="gray.200"
        borderBottomWidth={1}
        px={6}
        py={3}
        height="70px"
      >
        <Flex alignItems="center">
          <Text
            textTransform="uppercase"
            letterSpacing={2}
            fontSize={16}
            color="blue.500"
            fontWeight={600}
            mr={3}
          >
            Collab
          </Text>
          <Avatar name={user.name} size="sm" />
        </Flex>
        <Flex alignItems="center">
          <Box>
            <KnockFeedProvider
              apiKey={process.env.BLITZ_PUBLIC_KNOCK_CLIENT_ID!}
              feedId={process.env.BLITZ_PUBLIC_KNOCK_FEED_ID!}
              userId={`${user.id}`}
              host="https://332a-2603-7000-873d-e800-e907-966f-2cd3-8bd4.ngrok-free.app"
            >
              <Box>
                <NotificationIconButton ref={notifButtonRef} onClick={onOpenFeed} />
                <NotificationFeedPopover
                  buttonRef={notifButtonRef}
                  isVisible={isFeedOpen}
                  onClose={onCloseFeed}
                  placement="bottom-end"
                />
              </Box>
            </KnockFeedProvider>
          </Box>
          {user?.name && (
            <IconButton
              variant="ghost"
              aria-label="settings"
              icon={<SettingsIcon />}
              onClick={onOpenSettingsModal}
            />
          )}
          {user?.name && (
            <Button
              ml={2}
              size="sm"
              variant="outline"
              colorScheme="orange"
              leftIcon={<Icon as={FiLogOut} />}
              onClick={() => logoutMutation()}
            >
              Logout
            </Button>
          )}
        </Flex>
      </Flex>
      <Flex height="calc(100% - 70px)" width="100%">
        {children}
      </Flex>
    </Flex>
  )
}

export default Layout
