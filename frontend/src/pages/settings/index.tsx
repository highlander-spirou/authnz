import BiometricsSection from "./index-sections/biometrics"
import DeviceSessionsSection from "./index-sections/device"
import OTPSection from "./index-sections/otp"
import PasswordSection from "./index-sections/password"
import ProfileSection from "./index-sections/profile"

const SettingsPage = () => {
  return (
    <>
      <div className="restrict-content-grow grid my-10">
        <ProfileSection />
        <hr className="border-gray-200 my-10" />
        <PasswordSection />
        <hr className="border-gray-200 my-10" />
        <BiometricsSection />
        <hr className="border-gray-200 my-10" />
        <OTPSection />
        <hr className="border-gray-200 my-10" />
        <DeviceSessionsSection />
      </div>
    </>
  )
}

export default SettingsPage
