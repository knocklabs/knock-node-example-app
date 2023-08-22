import { AuthenticationError, useMutation, PromiseReturnType } from "blitz"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

import { Box, Flex, Heading, Link, Text } from "@chakra-ui/layout"
import { Input } from "@chakra-ui/input"
import { Field } from "formik"
import { Center } from "@chakra-ui/react"
import * as analytics from "app/lib/analytics"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <Center height="100vh">
      <Box borderWidth={1} p={6} borderColor="gray.200">
        <Heading size="lg">Collab App Example</Heading>
        <Text>To continue please enter your email.</Text>
        <Text>
          Or{" "}
          <Link color="blue" href="/signup">
            sign up here
          </Link>{" "}
          instead.
        </Text>

        <Flex mt={6} w="400px">
          <Form
            submitText="Login"
            initialValues={{ email: "", password: "" }}
            schema={Login}
            onSubmit={async (values) => {
              try {
                const user = await loginMutation(values)
                if (analytics.ENABLE_SEGMENT) {
                  analytics.identify(user)
                }
                props.onSuccess?.(user)
              } catch (error: any) {
                if (error instanceof AuthenticationError) {
                  return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
                } else {
                  return {
                    [FORM_ERROR]:
                      "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                  }
                }
              }
            }}
          >
            <Field name="email">
              {({ field }) => <Input placeholder="jhammond@ingen.net" {...field} />}
            </Field>
            <Field name="password">
              {({ field }) => <Input mt={4} type="password" {...field} />}
            </Field>
          </Form>
        </Flex>
      </Box>
    </Center>
  )
}

export default LoginForm
