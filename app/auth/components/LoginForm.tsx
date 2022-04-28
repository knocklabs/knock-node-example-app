import { AuthenticationError, useMutation, PromiseReturnType } from "blitz"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

import { Box, Flex, Heading, Text } from "@chakra-ui/layout"
import { Input } from "@chakra-ui/input"
import { Button } from "@chakra-ui/button"
import { Field } from "formik"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

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
        <Text>To continue please enter your email.</Text>

        <Flex mt={6} w="400px">
          <Form
            submitText="Login"
            initialValues={{ email: "", password: "" }}
            schema={Login}
            onSubmit={async (values) => {
              try {
                const user = await loginMutation(values)
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
    </Flex>
  )
}

export default LoginForm
