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

function fetchEvents(term) {
  console.log("Ich mache mich auf die Suche ...");

  // fetch("http://localhost:8080/sked-lag-impl/post-find-calendar-events", {
  return fetch(
    "https://dev01.fhws.de/sked-lag-impl/post-find-calendar-events",
    {
      method: "POST",
      body: JSON.stringify({
        semestercode: 191,
        term: term
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

  const [result, setResult] = React.useState(null);

  let nicknames = [];

  function onSubmit(event) {
    event.preventDefault();
    fetchEvents(term).then(function(response) {
      setResult(response);
    });
  }

  return (
    <Paper>
      <h1>Veranstaltungssuche</h1>
      <form onSubmit={onSubmit}>
        <TextField
          id="outlined-search"
          label="Suche"
          type="search"
          margin="normal"
          variant="outlined"
          value={term}
          onChange={onTermChange}
        />
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
