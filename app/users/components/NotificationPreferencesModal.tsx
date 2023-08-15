import { useMemo, useEffect, useState } from "react"

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

import Knock, { PreferenceSet, WorkflowPreferences } from "@knocklabs/client"
import FallbackSpinner from "app/core/components/FallbackSpinner"

const workflowKeyToName = {
  "new-comment": "New comments",
  "new-asset": "New assets",
}

const NotificationPreferencesModal = ({ user, isOpen, onClose }) => {
  const [preferences, setPreferences] = useState<PreferenceSet>()

  const knockClient = useMemo(() => {
    const knock = new Knock(process.env.BLITZ_PUBLIC_KNOCK_CLIENT_ID!)
    knock.authenticate(user.id)

    return knock
  }, [user.id])

  useEffect(() => {
    knockClient.preferences.get().then((preferences) => {
      setPreferences(preferences)
    })
  }, [knockClient])

  if (!preferences) {
    return <FallbackSpinner />
  }

  const preparedPreferencesWorkflows: WorkflowPreferences = {
    "new-comment": {
      channel_types: { email: true, in_app_feed: true },
      ...(preferences.workflows["new-comment"] as object),
    },
    "new-asset": {
      channel_types: { email: true, in_app_feed: true },
      ...(preferences.workflows["new-asset"] as object),
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
                let updatedPreferences = { ...preferences, workflows: values }
                updatedPreferences = await knockClient.preferences.set(updatedPreferences)
                setPreferences(updatedPreferences)
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
