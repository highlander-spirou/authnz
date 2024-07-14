import dayjs, { ManipulateType } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");


export const addTime = (timeAdd: number, unit: ManipulateType) => {
  const ttl = dayjs().add(timeAdd, unit);
  return ttl;
};
