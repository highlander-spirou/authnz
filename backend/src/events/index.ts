import EventEmitter2 from "eventemitter2"
import { update_user_verify_tz } from "./handlers/mfa"

const observer = new EventEmitter2()

observer.on("update_user_verify_tz", update_user_verify_tz)

export default observer
