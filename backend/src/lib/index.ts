import * as crypto from 'crypto'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone); 
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

export const generateToken = () => {
    return crypto.randomBytes(16).toString('hex');
};


export const addTime = (timeAdd, format: "number" | "date") => {
    const ttl = dayjs().add(timeAdd, "hours")

    return format === 'date' ? ttl.toDate() : ttl.valueOf()
}