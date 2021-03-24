import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (date: string): string => {
  return dayjs(date).format("HH:mm - YYYY-MM-DD");
};

export const fromNow =(date:string) :string => {
  return dayjs(date).fromNow()
}