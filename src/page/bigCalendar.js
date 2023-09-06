import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Toolbar from "./Toolbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import events from "../page/events";
import { styled } from "styled-components";
import { useQuery } from "react-query";
import { onLoadData } from "../service/portal/calendar";

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
          background-color: #ccc;
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
  //캘린더를 DragAndDrop으로 바꿉니다.
  const DragAndDropCalendar = withDragAndDrop(Calendar);

  // const formatName = (name, count) => `${name} ID ${count}`;

  //유즈쿼리로 데이터를 받아옵니다.
  const { data: dataOnLoadData, refetch: refetchOnLoadData } = useQuery(
    "onLoadData",
    onLoadData
  );
  console.log("## check dataOnLoadData ==>", dataOnLoadData);

  //오라클 에서 들어오는 DATE 값을 JAVASCRIPT양식으로 바꿔주는 함수
  function formatOracleDate(oracleDateStr) {
    return new Date(oracleDateStr);
  }
  //가져올 이벤트를 넣을 useState.
  const [myEvents, setMyEvents] = useState([]);

  //쿼리가 발생하면 데이터를 받아서 이벤트를 가져온다.
  useEffect(() => {
    if (dataOnLoadData) {
      //여기서 isDraggled를 선언한다. 기본값은 false다. 아무값도 넣지 않는다면 true
      //isDraggable: ind % 2 === 0 순서 나누기 2 즉 홀수 인 인자들만 움직일 수 있다.
      const adjEvents = Object.values(dataOnLoadData).map((data, ind) => ({
        ...data,
        start: formatOracleDate(data.start),
        end: formatOracleDate(data.end),
        // isDraggable: ind % 2 === 0,
        // isDraggable: true,
      }));
      setMyEvents(adjEvents);
      console.log("## check adjEvents!!! ==>", adjEvents);
    }
  }, [dataOnLoadData]);

  // const [draggedEvent, setDraggedEvent] = useState();
  // const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true);
  // const [counters, setCounters] = useState({ item1: 0, item2: 0 });

  //이벤트의 draggle 여부를 확인하여 가져온다. isDraggle외에도 다른 객체들을 반환한다.
  // const eventPropGetter = useCallback(
  //   (event) => ({
  //     ...(event.isDraggable
  //       ? { className: "isDraggable" }
  //       : { className: "nonDraggable" }),
  //   }),
  //   []
  // );

  // const handleDragStart = useCallback((event) => setDraggedEvent(event), []);

  // const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent]);

  //표 밖의 외부 값들을 새로운 값으로 드래그 할 때 가능 여부를 파악한다.
  // const customOnDragOver = useCallback(
  //   (dragEvent) => {
  //     if (draggedEvent !== "undroppable") {
  //       console.log("preventDefault");
  //       dragEvent.preventDefault();
  //     }
  //   },
  //   [draggedEvent]
  // );

  // const handleDisplayDragItemInCell = useCallback(
  //   () => setDisplayDragItemInCell((prev) => !prev),
  //   []
  // );

  //이벤트 이동 기능
  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        console.log("## find prev==> ", prev);
        console.log("## find event==> ", event);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end, allDay }];
      });
    },
    [setMyEvents]
  );

  //새로운 이벤트 입력 기능
  const newEvent = useCallback(
    (event, start, end) => {
      setMyEvents((prev) => {
        console.log(prev);
        console.log(start);
        console.log(end);
        //입력 받을 창
        const title = window.prompt("New Event Name");
        if (title) {
          setMyEvents((prev) => [...prev, { start, end, title }]);
        }
        //드래그 해서 시작과 끝을 찾을 창
        const idList = prev.map((item) => item.id);
        const newId = Math.max(...idList) + 1;
        return [...prev, { ...event, id: newId }];
      });
    },
    [setMyEvents]
  );
  //외부에서 값을 가져와서 캘린더에 넣는 함수
  // const onDropFromOutside = useCallback(
  //   ({ start, end, allDay: isAllDay }) => {
  //     if (draggedEvent === "undroppable") {
  //       setDraggedEvent(null);
  //       return;
  //     }

  //     const { name } = draggedEvent;
  //     const event = {
  //       title: formatName(name, counters[name]),
  //       start,
  //       end,
  //       isAllDay,
  //     };
  //     setDraggedEvent(null);
  //     setCounters((prev) => {
  //       const { [name]: count } = prev;
  //       return {
  //         ...prev,
  //         [name]: count + 1,
  //       };
  //     });
  //     newEvent(event);
  //   },
  //   [draggedEvent, counters, setDraggedEvent, setCounters, newEvent]
  // );

  //일정 리사이즈 할 때 나오는 콜백함수 인자로 event start end가 있다.
  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        console.log(prev);
        console.log(start);
        console.log(end);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  //이름 클릭했을 때 나오는 얼럿 title id allDay Start 등을 볼 수 있다.
  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

  return (
    <Container>
      <DragAndDropCalendar
        localizer={momentLocalizer(moment)}
        //가져올 이벤트 값
        events={myEvents}
        //위치 재정의
        onEventDrop={moveEvent}
        //사이즈 재정의
        onEventResize={resizeEvent}
        // draggableAccessor="isDraggable"
        // eventPropGetter={eventPropGetter}
        // dragFromOutsideItem={displayDragItemInCell ? dragFromOutsideItem : null}
        // onDragOver={customOnDragOver}
        //새로운 이벤트 생성 함수
        onSelectSlot={newEvent}
        //이벤트 클릭시 실행 함수
        onSelectEvent={handleSelectEvent}
        // onDropFromOutside={onDropFromOutside}
        resizable
        selectable
        style={{ height: 900 }}
        components={{ toolbar: Toolbar }}
      />
    </Container>
  );
};
export default BigCalendarInfo;
