import userKeys from "@user/queries/queryKeyFactories"
import queryClient from "./query-client"
import { useEffect } from "react"
import { UserInfo } from "@user/types"

const App = () => {
  const data = queryClient.getQueryData<UserInfo>(userKeys.info)

  useEffect(() => {
    console.log("data", data)
  }, [data])

  return (
    <>
      <div className="w-full h-full">
        {!data?.name ? "You haven't set the user name yet" : `Welcome, ${data.name}👋`}
      </div>
    </>
  )
}

export default App
