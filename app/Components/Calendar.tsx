"use client";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CustomEvent } from "../Types/Lectures";
import AuthGoogle from "./AuthGoogle";
import LectureSchedule from "../Types/Lectures";
import { Button } from "@mui/material";
import PopUp from "reactjs-popup";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../configFirebase";

interface CalendarCustomState {
  events: CustomEvent[];
  userID: string;
}

export class CalendarCustom extends React.Component<{}, CalendarCustomState> {
  constructor(props: any) {
    super(props);
    const LectureEvents: CustomEvent[] = [];
    this.state = { events: LectureEvents, userID: "" };
  }

  OnDataFound = (LectureSchedule: LectureSchedule[], userID: string) => {
    const LectureEvents: CustomEvent[] = [];
    for (let i = 0; i < LectureSchedule.length; i++) {
      const event: CustomEvent = {
        firestoreId: LectureSchedule[i].id,
        id: i.toString(),
        title: LectureSchedule[i].title,
        start: LectureSchedule[i].start.toISOString(),
        end: LectureSchedule[i].end.toISOString(),
        checked: LectureSchedule[i].checked,
      };
      LectureEvents.push(event);
    }
    this.setState({ events: LectureEvents, userID: userID });
  };

  async setCheckBoxFirestore(checked: boolean, eventId: string) {
    const userRef = doc(db, "Users", this.state.userID);
    const lecturesRef = collection(userRef, "Lectures");
    const lecturesDoc = doc(lecturesRef, eventId);
    const dataDoc = await getDoc(lecturesDoc);
    const data = dataDoc.data() as LectureSchedule;
    setDoc(lecturesDoc, {
      checked: checked,
      end: data.end,
      start: data.start,
      title: data.title,
    });
    const dataDoc2 = await getDoc(lecturesDoc);
  }

  handleCheckboxChange = (eventId: string) => {
    const index = parseInt(eventId);
    this.setCheckBoxFirestore(
      !this.state.events[index].checked,
      this.state.events[index].firestoreId
    );
    this.setState((prevState) => ({
      events: prevState.events.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            checked: !event.checked, // Toggle the checked state
          };
        }
        return event;
      }),
    }));
  };

  renderEventContent = (eventInfo: any) => {
    const title = eventInfo.event.title;
    const isVorlsung = title.includes("(V)");
    let backgroundColor = "blue";
    if (isVorlsung) {
      backgroundColor = "red";
    }
    if (eventInfo.event.extendedProps.checked) {
      backgroundColor = "green";
    }
    return (
      <div style={{ backgroundColor, width: "100%", height: "100%" }}>
        <input
          style={{ width: "20px", height: "20px" }}
          type="checkbox"
          id={eventInfo.event.id}
          checked={eventInfo.event.extendedProps.checked}
          onChange={() => this.handleCheckboxChange(eventInfo.event.id)}
        />
        <b>{eventInfo.event.title}</b>
      </div>
    );
  };

  async handleDeleteClick() {
    const userRef = doc(db, "Users", this.state.userID);
    const lecturesRef = collection(userRef, "Lectures");
    const lecturesDoc = await getDocs(lecturesRef);
    lecturesDoc.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    await deleteDoc(userRef);
    console.log("Delete clicked");
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <AuthGoogle user={null} onDataFound={this.OnDataFound} />
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          weekends={false}
          events={this.state.events}
          eventContent={this.renderEventContent}
          slotMinTime={"08:00:00"}
          slotMaxTime={"20:00:00"}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <PopUp
            trigger={
              <Button
                variant="outlined"
                style={{ fontSize: "1.5rem", padding: "10px 20px" }}
              >
                Delete old data and upload new file
              </Button>
            }
            position="top center"
          >
            <div>
              <p>
                All your data will be deleted. Are you sure you want to
                continue?
              </p>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleDeleteClick}
              >
                Confirm
              </Button>
            </div>
          </PopUp>
        </div>
      </div>
    );
  }
}

// export default function Calendar({ events }: { events: CustomEvent[] }) {
//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, eventId: string) => {
//     // Update the event's showEvent property in the events array
//     const updatedEvents = events.map(event => {
//       if (event.id === eventId) {
//         return {
//           ...event,
//           extendedProps: {
//             ...event.extendedProps,
//             showEvent: e.target.checked // Set showEvent to true/false based on checkbox state
//           }
//         };
//       }
//       return event;
//     })};
//   console.log(events.length);
//   return (
//     <FullCalendar
//       plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
//       initialView="timeGridWeek"
//       weekends={false}
//       events={events}
//       eventContent={renderEventContent}
//       slotMinTime={"08:00:00"}
//       slotMaxTime={"20:00:00"}
//     />
//   );
// }
