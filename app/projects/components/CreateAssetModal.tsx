import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  FormControl,
  Input,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react"
import Form from "app/core/components/Form"
import { Field } from "formik"

const CreateAssetModal = ({ isOpen, onClose, createAssetMutation, slug, project }) => {
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
                  {({ field }) => <Input placeholder="Asset Name" {...field} />}
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
  )
}

export default CreateAssetModal
