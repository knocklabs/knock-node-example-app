import { Center, Flex, Spinner, Text } from "@chakra-ui/react"

const FallbackSpinner = () => (
  <Flex flexDirection="column" height="100%">
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
      <Flex>
        <Text
          textTransform="uppercase"
          letterSpacing={2}
          fontSize={16}
          color="blue.500"
          fontWeight={600}
        >
          Collab
        </Text>
      </Flex>
    </Flex>
    <Center height="100vh">
      <Spinner />
    </Center>
  </Flex>
)

export default FallbackSpinner
