import React from "react";

import {
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from "@material-ui/core";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";

function useFormFieldState(defaultValue) {
  const [state, setState] = React.useState(defaultValue);
  function onChange(event) {
    setState(event.target.value);
  }
  return [state, onChange];
}

function fetchEvents(term, lecturer) {
  console.log(
    "Ich mache mich auf die Suche term: ".concat(
      term,
      " lecturer: ",
      lecturer,
      " ..."
    )
  );

  // fetch("http://localhost:8080/sked-lag-impl/post-find-calendar-events", {
  return fetch(
    "https://dev01.fhws.de/sked-lag-impl/post-find-calendar-events",
    {
      method: "POST",
      body: JSON.stringify({
        semestercode: 191,
        term: term,
        lecturer: lecturer
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  ).then(function(response) {
    return response.json();
  });
}

export function Events() {
  const [term, onTermChange] = useFormFieldState("");
  const [lecturer, onLecturerChange] = useFormFieldState("");

  const [result, setResult] = React.useState(null);

  function onSubmit(event) {
    event.preventDefault();
    fetchEvents(term, lecturer).then(function(response) {
      setResult(response);
    });
  }

  function addEventToSchedule(eventId) {
    console.log(
      "Ich füge dieses event meine Kalender hinzu. eventid: ".concat(
        eventId,
        " ..."
      )
    );

    return fetch(
      "https://dev01.fhws.de/sked-lag-impl/post-add-event-to-schedule",
      {
        method: "POST",
        body: JSON.stringify({
          semestercode: 191,
          eventId: eventId
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    ).then(function(response) {
      console.log(" ... event hinzugefügt.");
    });
  }

  return (
    <Paper>
      <h1>Veranstaltungssuche</h1>
      <form onSubmit={onSubmit}>
        <TextField
          id="outlined-search-1"
          label="Veranstaltung"
          type="search"
          margin="normal"
          variant="outlined"
          style={{ margin: 8 }}
          value={term}
          onChange={onTermChange}
        />
        <TextField
          id="outlined-search-2"
          label="Dozent"
          type="search"
          margin="normal"
          variant="outlined"
          style={{ margin: 8 }}
          value={lecturer}
          onChange={onLecturerChange}
          onKey
        />
        <button type="submit" style={{ visibility: "hidden" }}>
          Submit
        </button>
      </form>
      <Table>
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "60%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Art</TableCell>
            <TableCell>Modulname</TableCell>
            <TableCell>Dozent(-en)</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {result &&
            result.calendarEvents.map(function(calendarEvent) {
              return (
                <TableRow key={calendarEvent.id}>
                  <TableCell>{calendarEvent.eventType}</TableCell>
                  <TableCell component="th" scope="row">
                    {calendarEvent.moduleName}
                  </TableCell>
                  <TableCell>
                    {calendarEvent.lecturers
                      .map(lecturer => lecturer.nickname)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <AddToQueueIcon
                        onClick={() => addEventToSchedule(calendarEvent.id)}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Paper>
  );
}
