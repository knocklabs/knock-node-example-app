import { useState } from "react"

import { Box, Text } from "@chakra-ui/layout"
import {
  Button,
  Checkbox,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react"

import { Formik, Field } from "formik"
import { NEW_ASSET, NEW_COMMENT } from "app/lib/workflows"

const workflowKeyToName = {
  [NEW_COMMENT]: "New comments",
  [NEW_ASSET]: "New assets",
}

const NotificationPreferencesModal = ({ user, isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({})

  /*
  TODO: ADD KNOCK - PREFERENCES

  Use the knock client to get the user's preferences, then set those preferences in state
  */

  // @ts-ignore (remove when adding Knock type)
  const newCommentWorkflow = (preferences?.workflows && preferences?.workflows[NEW_COMMENT]) || {}
  // @ts-ignore (remove when adding Knock type)
  const newAssetWorkflow = (preferences?.workflows && preferences?.workflows[NEW_ASSET]) || {}

  const preparedPreferencesWorkflows = {
    [NEW_COMMENT]: {
      channel_types: { email: true, in_app_feed: true },
      ...(newCommentWorkflow as object),
    },
    [NEW_ASSET]: {
      channel_types: { email: true, in_app_feed: true },
      ...(newAssetWorkflow as object),
    },
  }

  return (
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
          Notification preferences
          <Text fontSize="14px" fontWeight="500" pr={3}>
            Select which notifications you want to receive across which channels.
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={5}>
          <Box background="beige.100">
            <Formik
              initialValues={preparedPreferencesWorkflows}
              onSubmit={async (values) => {
                /*
                TODO: ADD KNOCK - PREFERENCES

                Uncomment the following, then make a Knock call to set the user's preferences with the updated preferences and set them in state
                */

                // let updatedPreferences = { ...preferences, workflows: values }

                onClose()
              }}
            >
              {({ handleSubmit, isSubmitting, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  <FormControl mt={4} as={SimpleGrid} templateColumns={"50% 25% 25%"} spacingY={4}>
                    <Box />
                    <Text
                      textStyle="formLabel"
                      fontWeight="500"
                      color="gray.900"
                      fontSize="14px"
                      justifySelf="center"
                    >
                      In-app
                    </Text>
                    <Text
                      textStyle="formLabel"
                      fontWeight="500"
                      color="gray.900"
                      fontSize="14px"
                      justifySelf="center"
                    >
                      Email
                    </Text>
                    {Object.keys(preparedPreferencesWorkflows).map((workflowKey) => (
                      <Field key={workflowKey} name={workflowKey}>
                        {({ field }) => (
                          <>
                            <Text
                              textStyle="formLabel"
                              fontWeight="500"
                              color="gray.900"
                              fontSize="14px"
                            >
                              {workflowKeyToName[workflowKey] || workflowKey}
                            </Text>
                            <Checkbox
                              isChecked={field.value?.channel_types?.in_app_feed}
                              justifySelf="center"
                              onChange={(e) => {
                                setFieldValue(
                                  `${workflowKey}.channel_types.in_app_feed`,
                                  e.target.checked
                                )
                              }}
                            />
                            <Checkbox
                              isChecked={field.value?.channel_types?.email}
                              justifySelf="center"
                              onChange={(e) => {
                                setFieldValue(
                                  `${workflowKey}.channel_types.email`,
                                  e.target.checked
                                )
                              }}
                            />
                          </>
                        )}
                      </Field>
                    ))}
                  </FormControl>
                  <ModalFooter mt={8}>
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
                    <Button
                      fontWeight="500"
                      size="sm"
                      colorScheme="blue"
                      type="submit"
                      disabled={isSubmitting}
                      ml={2}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </Formik>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NotificationPreferencesModal
