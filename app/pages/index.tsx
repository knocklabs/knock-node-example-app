import { useEffect, Suspense } from "react"
import { BlitzPage, useMutation } from "blitz"
import { useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const HomePage = () => {
  const router = useRouter()
  const user = useCurrentUser()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [])

  return <h1>HOME</h1>
}

const Home: BlitzPage = () => {
  return (
    <Suspense fallback="Loading...">
      <HomePage />
    </Suspense>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
