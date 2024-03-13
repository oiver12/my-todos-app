import MainPage from "./Components/MainPage"
import { parserICSFile } from "./Types/Lectures"

export default async function Index() {
  return (
    <html lang="en">
      <body>
        <MainPage />
      </body>
    </html>
  );
}