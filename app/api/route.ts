import { NextResponse } from "next/server";
import { db } from "./../configFirebase";
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { parserICSFile } from "../Types/Lectures";

export async function GET() {
    return NextResponse.json({ message: "Hello, World!" });
}

export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  try {
    await parseFileAndWriteToDatabase(file, formData.get("userID") as string, formData.get("email") as string);
    return new Response(null, { status: 200 });
  }
  catch (e) {
    return new Response(null, { status: 500 });
  }
}


async function parseFileAndWriteToDatabase(file: File, userID: string, email: string) {
  const lectures = await parserICSFile(file);
  //Delete old docs, if already exist and create new ones
  const userExistsalready = await checkUserDocumentExists(userID);
  if(userExistsalready) {
    const userRef = doc(db, "Users", userID);
    const lecturesRef = collection(userRef, "Lectures");
    const lecturesDoc = await getDocs(lecturesRef);
    console.log("Deleting old docs count: " + lecturesDoc.size);
    lecturesDoc.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    await deleteDoc(userRef);
  }
  await setDoc(doc(db, "Users", userID), {
    id: userID,
    email: email,
  });

  const userRef = doc(db, "Users", userID);
  lectures.forEach(async (lecture) => {
    if(lecture.title === undefined || lecture.start === undefined || lecture.end === undefined) {
      return;
    }
    await addDoc(collection(userRef, "Lectures"), {
      title: lecture.title,
      start: lecture.start,
      end: lecture.end,
      checked: false,
    });
  });
  console.log(lectures.length);
}

async function  checkUserDocumentExists (id: string)
 {
      const userDoc = await getDocs(collection(db, "Users"));
      let userExists = false;
      userDoc.forEach((doc) => {
          if(doc.id == id) {
            userExists = true;
            return true;
          }
      });
      return userExists;
    };