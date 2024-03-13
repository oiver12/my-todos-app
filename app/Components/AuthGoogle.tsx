"use client";
import React from "react";
import { useEffect } from "react";
import configFirebase from "../configFirebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Popup from "reactjs-popup";
import "./Auth.css";
import ConfigureLecture from "./ConfigureLectureComponent";
import LectureSchedule from "../Types/Lectures";

interface AuthGoogleProps {
  user: firebase.User | null;
  onDataFound: (LectureSchedule: LectureSchedule[], userID: string) => void;
}

interface MyComponentState {
  user: firebase.User | null;
  signIn: () => void;
  signOut: () => void;
}

class AuthGoogle extends React.Component<AuthGoogleProps, MyComponentState> {
  constructor(props: AuthGoogleProps) {
    super(props);
    configFirebase();
    // Initialize firebase and google providerfirebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // Sign in and sign out functins
    const signInFunction = () => auth.signInWithPopup(provider);
    const signOutFunction = () => auth.signOut();
    // Sign in and sign out functins
    this.state = {
      user: props.user,
      signIn: signInFunction,
      signOut: signOutFunction,
    };
  }

  componentDidMount(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        this.setState({ user });
      } else {
        // User is signed out
        this.setState({ user: null });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.user ? (
          <>
            <span>Signed in as : {this.state.user.email}</span>
            <button onClick={this.state.signOut}>Sign Out</button>
            <ConfigureLecture
              email={this.state.user.email!}
              id={this.state.user.uid}
              onDataFound={this.props.onDataFound}
            />
          </>
        ) : (
          <div className="signin-page">
            <div className="signin-container">
              <div className="signin-content">
                <h1>Welcome to Lecture Plnaner</h1>
                <p>Please log in to continue.</p>
                <button onClick={this.state.signIn} className="signin-button">
                  Sign in with Google
                </button>
                <ol className="step-guide">
                  <li>1. Log in using your Google account</li>
                  <li>2. Upload your lecture schedule (ICS file)</li>
                  <li>3. Configure your Lectures</li>
                  <li>4. Use the Webapp</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AuthGoogle;
