import React from "react";
import ReactDOM from "react-dom";
import { MenuList, ListItem } from "@material-ui/core";
import { Events } from "./Pages/Events";
import { MyEvents } from "./Pages/MyEvents";
import { MyCalendar } from "./Pages/MyCalendar";

import "./styles.css";

function useNavigationHandler(target, setStatus) {
  return React.useCallback(
    function(event) {
      event.preventDefault();
      setStatus(target);
    },
    [target, setStatus]
  );
}

function App() {
  const [status, setStatus] = React.useState("events");

  const eventsOnClick = useNavigationHandler("events", setStatus);
  const myCalendarOnClick = useNavigationHandler("myCalendar", setStatus);
  const myEventsOnClick = useNavigationHandler("myEvents", setStatus);

  return (
    <div className="App">
      <nav>
        <MenuList>
          <ListItem button onClick={eventsOnClick}>
            Veranstaltungssuche
          </ListItem>
          <ListItem button onClick={myCalendarOnClick}>
            Mein Kalender
          </ListItem>
          <ListItem button onClick={myEventsOnClick}>
            Meine Terminliste
          </ListItem>
        </MenuList>
      </nav>
      <main>
        {status === "events" && <Events />}
        {status === "myEvents" && <MyEvents />}
        {status === "myCalendar" && <MyCalendar />}
      </main>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
