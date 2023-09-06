import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Toolbar from "./Toolbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { styled } from "styled-components";
import { useQuery } from "react-query";
import { onLoadData } from "../service/portal/calendar";
import { useMutation } from "react-query";
import { submit } from "../service/portal/calendar";

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

  //유즈쿼리로 데이터를 받아옵니다.
  const { data: dataOnLoadData, refetch: refetchOnLoadData } = useQuery(
    "onLoadData",
    onLoadData
  );

  //오라클 에서 들어오는 DATE 값을 JAVASCRIPT양식으로 바꿔주는 함수
  function formatToJSDate(oracleDateStr) {
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
        start: formatToJSDate(data.start),
        end: formatToJSDate(data.end),
        // isDraggable: ind % 2 === 0,
        // isDraggable: true,
      }));
      setMyEvents(adjEvents);
    }
  }, [dataOnLoadData]);

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

  //새로운 값을 입력할 유즈쿼리문
  const {
    data: dataSubmit,
    mutate: mutateSubmit,
    isSuccess: isSuccessSubmit,
  } = useMutation("submit", submit);

  //DB에 넣을 시간양식 재포맷
  function formatToOracleDate(jsDateStr) {
    const date = new Date(jsDateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  //새로운 이벤트 입력 기능
  const newEvent = useCallback(
    (event, start, end) => {
      setMyEvents((prev) => {
        //입력 받을 창
        const title = window.prompt("New Event Name");
        console.log("##log prev ==>", prev);
        console.log("##log event ==>", event);
        console.log("##log event.start ==>", event.slots[0]);
        console.log("##log event.end ==>", event.slots[event.slots.length - 1]);
        mutateSubmit({
          title: title,
          start: formatToOracleDate(event.slots[0]),
          end: formatToOracleDate(event.slots[event.slots.length - 1]),
        });
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
  //데이터 입력이 완료되면 리패치를 하여 재랜더링 되게 한다.
  useEffect(() => {
    if (isSuccessSubmit && dataSubmit) {
      console.debug("## submit refetch => ", dataSubmit);
      refetchOnLoadData();
    }
  }, [isSuccessSubmit, dataSubmit, refetchOnLoadData]);

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
        //새로운 이벤트 생성 함수
        onSelectSlot={newEvent}
        //이벤트 클릭시 실행 함수
        onSelectEvent={handleSelectEvent}
        resizable
        selectable
        style={{ height: 900 }}
        components={{ toolbar: Toolbar }}
      />
    </Container>
  );
};
export default BigCalendarInfo;
