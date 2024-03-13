import React from "react";
import DataGridComponent from "./Grid";
import { CalendarCustom } from "./Calendar";
import LectureSchedule, {
  parseICSFileFrompath,
  CustomEvent,
} from "../Types/Lectures"; // Import CustomEvent type
import AuthGoogle from "./AuthGoogle";

// function getEvents() {
//   const lectures = parseICSFileFrompath("ETH_timetable_20240308.ics");
//   LectureEvents.length = 0;
//   for (let i = 0; i < lectures.length; i++) {
//     if (lectures[i].start === undefined || lectures[i].end === undefined) {
//       console.log("Undefined");
//       continue;
//     }
//     const event: CustomEvent = {
//       id: i.toString(),
//       title: lectures[i].title,
//       start: lectures[i].start.toISOString(),
//       end: lectures[i].end.toISOString(),
//       checked: false,
//     };
//     LectureEvents.push(event);
//   }
// }

const MainPage = () => {
  return (
    <div>
      <CalendarCustom />
      {/* <DataGridComponent /> */}
    </div>
  );
};

export default MainPage;
