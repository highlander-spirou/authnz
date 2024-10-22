import { getBiometricStatusRequest } from "@mfa/queries/fetcher"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

const TestPage = () => {
  const { data, refetch } = useQuery({
    queryKey: ["asfhkjashf"],
    queryFn: getBiometricStatusRequest,
    enabled: false,
  })

  useEffect(() => {
    console.log("data", data)
  }, [data])

  return (
    <div>
      <button onClick={() => refetch()}>fetch data</button>
    </div>
  )
}

export default TestPage
