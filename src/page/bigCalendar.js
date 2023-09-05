import React, { useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Toolbar from "./Toolbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import events from "./events";
import { styled } from "styled-components";

const Container = styled.div`
  .rbc-addons-dnd {
    .rbc-addons-dnd-row-body {
      position: relative;
    }
    .rbc-addons-dnd-drag-row {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .rbc-day-bg {
      &:hover {
        background-color: #ccc;
      }
    }
    .rbc-addons-dnd-over {
      background-color: rgba(
        red($date-selection-bg-color),
        green($date-selection-bg-color),
        blue($date-selection-bg-color),
        0.3
      );
    }

    .rbc-event {
      transition: opacity 150ms;

      &:hover {
        .rbc-addons-dnd-resize-ns-icon,
        .rbc-addons-dnd-resize-ew-icon {
          display: block;
        }
      }
    }

    .rbc-addons-dnd-dragged-event {
      opacity: 0;
    }

    &.rbc-addons-dnd-is-dragging
      .rbc-event:not(.rbc-addons-dnd-dragged-event):not(
        .rbc-addons-dnd-drag-preview
      ) {
      opacity: 0.5;
    }

    .rbc-addons-dnd-resizable {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .rbc-addons-dnd-resize-ns-anchor {
      width: 100%;
      text-align: center;
      position: absolute;
      &:first-child {
        top: 0;
      }
      &:last-child {
        bottom: 0;
      }

      .rbc-addons-dnd-resize-ns-icon {
        display: none;
        border-top: 3px double;
        margin: 0 auto;
        width: 10px;
        cursor: ns-resize;
      }
    }

    .rbc-addons-dnd-resize-ew-anchor {
      position: absolute;
      top: 4px;
      bottom: 0;
      &:first-child {
        left: 0;
      }
      &:last-child {
        right: 0;
      }

      .rbc-addons-dnd-resize-ew-icon {
        display: none;
        border-left: 3px double;
        margin-top: auto;
        margin-bottom: auto;
        height: 10px;
        cursor: ew-resize;
      }
    }
  }
`;

const BigCalendarInfo = () => {
  const DragAndDropCalendar = withDragAndDrop(Calendar);

  const adjEvents = events.map((it, ind) => ({
    ...it,
    isDraggable: ind % 2 === 0,
  }));

  const formatName = (name, count) => `${name} ID ${count}`;

  const [myEvents, setMyEvents] = useState(adjEvents);
  const [draggedEvent, setDraggedEvent] = useState();
  const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true);
  const [counters, setCounters] = useState({ item1: 0, item2: 0 });

  const eventPropGetter = useCallback(
    (event) => ({
      ...(event.isDraggable
        ? { className: "isDraggable" }
        : { className: "nonDraggable" }),
    }),
    []
  );
  const handleDragStart = useCallback((event) => setDraggedEvent(event), []);

  const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent]);

  const customOnDragOver = useCallback(
    (dragEvent) => {
      if (draggedEvent !== "undroppable") {
        console.log("preventDefault");
        dragEvent.preventDefault();
      }
    },
    [draggedEvent]
  );

  const handleDisplayDragItemInCell = useCallback(
    () => setDisplayDragItemInCell((prev) => !prev),
    []
  );

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end, allDay }];
      });
    },
    [setMyEvents]
  );

  const newEvent = useCallback(
    (event) => {
      setMyEvents((prev) => {
        console.log(prev);
        const idList = prev.map((item) => item.id);
        const newId = Math.max(...idList) + 1;
        return [...prev, { ...event, id: newId }];
      });
    },
    [setMyEvents]
  );

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }) => {
      if (draggedEvent === "undroppable") {
        setDraggedEvent(null);
        return;
      }

      const { name } = draggedEvent;
      const event = {
        title: formatName(name, counters[name]),
        start,
        end,
        isAllDay,
      };
      setDraggedEvent(null);
      setCounters((prev) => {
        const { [name]: count } = prev;
        return {
          ...prev,
          [name]: count + 1,
        };
      });
      newEvent(event);
    },
    [draggedEvent, counters, setDraggedEvent, setCounters, newEvent]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  return (
    <Container>
      {Object.entries(counters).map(([name, count]) => (
        <div
          draggable="true"
          key={name}
          onDragStart={() =>
            handleDragStart({ title: formatName(name, count), name })
          }
        >
          {formatName(name, count)}
        </div>
      ))}
      <DragAndDropCalendar
        localizer={momentLocalizer(moment)}
        events={myEvents}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        draggableAccessor="isDraggable"
        eventPropGetter={eventPropGetter}
        dragFromOutsideItem={displayDragItemInCell ? dragFromOutsideItem : null}
        onDragOver={customOnDragOver}
        onSelectSlot={newEvent}
        onDropFromOutside={onDropFromOutside}
        resizable
        selectable
        style={{ height: 500 }}
        components={{ toolbar: Toolbar }}
      />
    </Container>
  );
};
export default BigCalendarInfo;
