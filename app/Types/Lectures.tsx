import * as fs from "fs";
import ical from "node-ical";

interface LectureSchedule {
  id: string;
  title: string;
  start: Date;
  end: Date;
  checked: boolean;
}

interface CustomEvent {
  firestoreId: string;
  id: string;
  title: string;
  start: string;
  end: string;
  checked: boolean;
}

interface eventData {
  summary: string;
  start: Date;
  end: Date;
}

export function parseICSFileFrompath(filePath: string): LectureSchedule[] {
  try {
    const lectures: LectureSchedule[] = [];
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = ical.parseICS(fileContent);
    const index = 0;
    for (let k in data) {
      if (!data.hasOwnProperty(k)) continue;
      if (!(data[k].type === "VEVENT")) continue;
      const event = data[k] as any as eventData;
      lectures.push({
        id: "",
        title: event.summary,
        start: event.start,
        end: event.end,
        checked: false,
      });
    }
    return lectures;
  } catch (err) {
    console.error(err);
    return [];
  }
}
export async function parserICSFile(file: File): Promise<LectureSchedule[]> {
  try {
    const lectures: LectureSchedule[] = [];
    const imageReader = file.stream().getReader();
    const chunks: Uint8Array[] = [];
    let result = await imageReader.read();

    while (!result.done) {
      chunks.push(result.value);
      result = await imageReader.read();
    }

    // Concatenate all chunks into one Uint8Array
    const concatenated = new Uint8Array(
      chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0)
    );

    let offset = 0;
    for (const chunk of chunks) {
      concatenated.set(chunk, offset);
      offset += chunk.byteLength;
    }

    // Decode the Uint8Array into a string
    const textDecoder = new TextDecoder("utf-8");
    const imageDataString = textDecoder.decode(concatenated);
    const parsedLectures = ical.parseICS(imageDataString);
    for (let k in parsedLectures) {
      if (!parsedLectures.hasOwnProperty(k)) continue;
      if (!(parsedLectures[k].type === "VEVENT")) continue;
      const event = parsedLectures[k] as any as eventData;
      lectures.push({
        id: "",
        title: event.summary,
        start: event.start,
        end: event.end,
        checked: false,
      });
    }
    return lectures;
  } catch (err) {
    console.error(err);
    return [];
  }
  // Parse the file and return an array of LectureSchedule objects
}

export default LectureSchedule;
export type { CustomEvent };
