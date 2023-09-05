import { useRecoilState, useResetRecoilState } from "recoil";
import { calendarData } from "../../recoil/atom/calendarData";

export default function useCalendarData() {
  const [onCalendarData, setOnCalendarData] = useRecoilState(calendarData);
  const resetOnCalendarData = useResetRecoilState(calendarData);

  return [onCalendarData, setOnCalendarData, resetOnCalendarData];
}
