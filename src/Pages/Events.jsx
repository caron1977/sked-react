import React from "react";

import {
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

function useFormFieldState(defaultValue) {
  const [state, setState] = React.useState(defaultValue);
  function onChange(event) {
    setState(event.target.value);
  }
  return [state, onChange];
}

function fetchEvents(term, lecturer) {
  console.log("Ich mache mich auf die Suche ..." + term + lecturer);

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
        <TableHead>
          <TableRow>
            <TableCell>Modulname</TableCell>
            <TableCell>Dozent(-en)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result &&
            result.calendarEvents.map(function(calendarEvent) {
              return (
                <TableRow key={calendarEvent.id}>
                  <TableCell component="th" scope="row">
                    {calendarEvent.moduleName}
                  </TableCell>
                  <TableCell>
                    {calendarEvent.lecturers
                      .map(lecturer => lecturer.nickname)
                      .join(", ")}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Paper>
  );
}
