import React from "react";
import { db } from "../configFirebase";
import "firebase/firestore";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import "./ConfigureLectureComponents.css";
import ReactLoading from "react-loading";
import LectureSchedule from "../Types/Lectures";
import { addDays } from "@fullcalendar/core/internal";

interface ConfigureLectureProps {
  email: string;
  id: string;
  onDataFound: (LectureSchedule: LectureSchedule[], userID: string) => void;
}

interface ConfigureLectureState {
  email: string;
  id: string;
  userDocExists: boolean;
  errorMessage: string;
  hasUploadedFile: boolean;
}

class ConfigureLecture extends React.Component<
  ConfigureLectureProps,
  ConfigureLectureState
> {
  handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      this.setState({ errorMessage: "" });
      return;
    }
    const file = event.target.files[0];
    const fileType = file.type;
    if (fileType !== "text/calendar") {
      this.setState({ errorMessage: "Please upload a .ics file." });
    } else {
      const formData = new FormData();
      formData.append("userID", this.state.id);
      formData.append("email", this.state.email);
      formData.append("file", file);
      fetch("/api", {
        method: "POST",
        body: formData,
        // headers: {
        //     'Content-Type': file.type,
        // },
      }).then((response) => {
        if (response.status === 200) {
          this.setState({ errorMessage: "" });
          this.checkUserDocumentExists(this.state.id);
        } else {
          this.setState({
            errorMessage:
              "An error occurred while uploading the file. Please try again.",
          });
        }
      });
      this.setState({ hasUploadedFile: true });
    }
  };

  async getLectures() {
    const currentDate = new Date();
    const twoWeeksAhead = addDays(currentDate, 14);
    const twoWeeksBehind = addDays(currentDate, -14);
    const userRef = doc(db, "Users", this.state.id);
    const lecturesRef = collection(userRef, "Lectures");
    const lectureQuery = query(
      lecturesRef,
      where("start", "<=", twoWeeksAhead),
      where("start", ">=", twoWeeksBehind)
    );
    const lecturesDoc = await getDocs(lectureQuery);
    const lectures: LectureSchedule[] = [];
    lecturesDoc.forEach((doc) => {
      const lecture = doc.data();
      if (
        lecture.title === undefined ||
        lecture.start === undefined ||
        lecture.end === undefined
      ) {
        return;
      }
      lectures.push({
        id: doc.id,
        title: lecture.title,
        start: lecture.start.toDate(),
        end: lecture.end.toDate(),
        checked: lecture.checked,
      });
    });
    this.props.onDataFound(lectures, this.state.id);
  }

  // Function to check if a user document exists
  checkUserDocumentExists = async (id: string) => {
    const userDoc = await getDocs(collection(db, "Users"));
    userDoc.forEach((doc) => {
      if (doc.id === id) {
        this.setState({ userDocExists: true });
        this.getLectures();
      }
    });
  };

  constructor(props: ConfigureLectureProps) {
    super(props);
    this.state = {
      email: props.email,
      id: props.id,
      userDocExists: false,
      errorMessage: "",
      hasUploadedFile: false,
    };
    this.checkUserDocumentExists(this.state.id);
  }

  render() {
    return (
      <div>
        {this.state.userDocExists ? (
          <></>
        ) : (
          <>
            {this.state.hasUploadedFile ? (
              <div className="container">
                <h1>Syncing your lectures with your calendar</h1>
                <ReactLoading
                  type={"spin"}
                  color={"#000000"}
                  height={100}
                  width={100}
                />
              </div>
            ) : (
              <div className="container">
                <h1>
                  Upload Your Agenda File for all you lectures in the ics file
                  forat
                </h1>
                <input
                  type="file"
                  accept=".ics"
                  onChange={this.handleFileUpload}
                />
                {this.state.errorMessage && (
                  <p className="error-message">{this.state.errorMessage}</p>
                )}
                <p className="info-message">
                  You can download your agenda file on MyStudies.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default ConfigureLecture;
