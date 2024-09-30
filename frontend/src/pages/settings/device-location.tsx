import { useEffect, useState } from "react"
import {
  ArrowUpLeftIcon,
  CircleAlertIcon,
  LocateFixedIcon,
  MapIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, Link, useSubmit } from "react-router-dom"
import { QueryClient } from "@tanstack/react-query"
import { formSerialize } from "@/lib/form-serializer"
import { AxiosError } from "axios"
import { getLocationFromOSM } from "@/lib/get-location"
import { changeDeviceRequest } from "@user/queries/fetcher"
import userKeys from "@user/queries/queryKeyFactories"

const useGetLocationPermission = () => {
  const [locationPermission, setLocationPermission] =
    useState<PermissionState | null>(null)

  useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      setLocationPermission(result.state)
      result.onchange = () => {
        setLocationPermission(result.state) // update when permission changes
      }
    })
  }, [])

  return locationPermission
}

export const action =
  (queryClient: QueryClient) =>
  async ({ request }) => {
    if (request.method !== "PUT") {
      throw new Response("", { status: 405 })
    }
    try {
      const payload = await formSerialize(request)
      await changeDeviceRequest(payload)
      queryClient.invalidateQueries({ queryKey: userKeys.deviceLocation })
      location.replace("/settings")
      return null
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data.message
      } else {
        return "Unknown error"
      }
    }
  }

const DeviceLocation = () => {
  const submit = useSubmit()
  const locationPermission = useGetLocationPermission()
  const [position, setPosition] = useState({ latitude: null, longitude: null })
  const [location, setLocation] = useState<string | null>()

  /* Get the position (lat, long) from geolocation API */
  useEffect(() => {
    const successCallback = (position) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    }

    const errorCallback = (error) => {
      console.log(error.message)
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
  }, [])

  /* Convert the position to location (district, city) from OpenStreetMap (OSM) */
  useEffect(() => {
    const handler = async () => {
      if (position.latitude && position.longitude) {
        const data = await getLocationFromOSM(
          position.latitude,
          position.longitude
        )
        if (data) {
          setLocation(`${data.district}, ${data.city}`)
        }
      }
    }
    handler()
  }, [position])

  const submitHandler = () => {
    submit(
      { formData: JSON.stringify({ location }) },
      { method: "PUT", action: "" }
    )
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-20 leading-relaxed">
        <h1>Change device location</h1>
        <hr className="border w-1/3 my-5" />
        {locationPermission === "prompt" && (
          <p className="flex font-bold text-red-1000">
            Please enable the location API at the top left corner{" "}
            <span>
              <ArrowUpLeftIcon />
            </span>
          </p>
        )}
        {locationPermission === "denied" && (
          <div className="grid place-items-center space-y-5">
            <h3 className="font-bold text-red-500">
              You may have accidently disabled the Location API.
            </h3>
            <p className="flex">
              Click on the{" "}
              <span className="mx-2">
                <CircleAlertIcon className="stroke-foreground" />
              </span>{" "}
              next to the address bar to enable it again
            </p>
            <Button variant="destructive">
              <Link to="/settings">I don't want to provide my location!</Link>
            </Button>
          </div>
        )}
        {locationPermission === "granted" && (
          <>
            {!location ? (
              <p className="flex">
                Trying to locate you{" "}
                <span className="mx-2">
                  <MapIcon />
                </span>
              </p>
            ) : (
              <div>
                <p className="flex">
                  <span className="mx-2">
                    <LocateFixedIcon />
                  </span>
                  Your device's location is:{" "}
                  <span className="font-semibold ml-2">{location}</span>
                </p>
                <div className="flex flex-col justify-center gap-5 mt-5">
                  <Form onSubmit={submitHandler}>
                    <Button variant="default" type="submit" className="w-full">
                      Continue
                    </Button>
                  </Form>
                  <Button variant="link">
                    <Link to="/settings">
                      Something is wrong, I'll do it later
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default DeviceLocation
