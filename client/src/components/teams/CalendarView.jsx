// CalendarView.jsx
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarView = ({ events }) => {
  const formattedEvents = events.map((e) => ({
    title: `${e.type}: ${e.title || e.location || "TBD"}`,
    start: new Date(e.date),
    end: new Date(e.date),
    allDay: true,
  }));

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        defaultView="month"
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default CalendarView;
