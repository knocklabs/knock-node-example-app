import { useMutation } from "blitz"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"

import { Box, Flex, Heading, Text } from "@chakra-ui/layout"
import { Input } from "@chakra-ui/input"
import { Button } from "@chakra-ui/button"
import { Field } from "formik"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width="100vw"
      height="100vh"
    >
      <Box borderWidth={1} p={6} borderColor="gray.200">
        <Heading size="lg">Collab App Example</Heading>
        <Text>Create an Account.</Text>

        <Flex mt={6} w="400px">
          <Form
            submitText="Sign Up"
            initialValues={{ name: "", email: "", password: "" }}
            schema={Signup}
            onSubmit={async (values) => {
              try {
                await signupMutation(values)
                props.onSuccess?.()
              } catch (error: any) {
                if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                  // This error comes from Prisma
                  return { email: "This email is already being used" }
                } else {
                  return { [FORM_ERROR]: error.toString() }
                }
              }
            }}
          >
            <Field name="name">{({ field }) => <Input placeholder="John Doe" {...field} />}</Field>
            <Field name="email">
              {({ field }) => <Input mt={4} placeholder="johndoe@example.com" {...field} />}
            </Field>
            <Field name="password">
              {({ field }) => <Input mt={4} placeholder="password" type="password" {...field} />}
            </Field>
          </Form>
        </Flex>
      </Box>
    </Flex>
  )
}

export default SignupForm
