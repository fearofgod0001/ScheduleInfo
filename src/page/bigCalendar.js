import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Toolbar from "./toolbar";
import ToolbarMini from "./toolbarMini";
import InputDateModal from "./inputDateModal";
import SideUpdatePage from "./sideUpdatePage";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { styled } from "styled-components";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { onLoadData } from "../service/portal/calendar";
import { submitSchedule } from "../service/portal/calendar";
import { updateSchedule } from "../service/portal/calendar";
import events from "./events";

const Container = styled.div`
  display: flex;
  overflow: hidden;
  .leftArticle {
    width: 20%;
    height: 100%;
    background-color: #f1f1f1;
  }
  .middleArticle {
    width: 80%;
    height: 100%;
  }
  .rightArticle {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    transition: 0.4s ease;
    z-index: 200;
  }

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
  //모달창을 띄울 useState
  const [onModal, setOnModal] = useState(0);
  //모달을 닫을 함수
  const closeSetOnData = () => {
    setOnModal(0);
  };

  //쿼리가 발생하면 데이터를 받아서 이벤트를 가져온다.
  useEffect(() => {
    if (dataOnLoadData) {
      const adjEvents = Object.values(dataOnLoadData).map((data, ind) => ({
        ...data,
        start: formatToJSDate(data.start),
      }));
      setMyEvents(adjEvents);
    }
  }, [dataOnLoadData]);

  //새로운 값을 입력할 유즈쿼리문
  const {
    data: dataUpdate,
    mutate: mutateUpdate,
    isSuccess: isSuccessUpdate,
  } = useMutation("updateSchedule", updateSchedule);

  //데이터 수정ㅇ 완료되면 리패치를 하여 재랜더링 되게 한다.
  useEffect(() => {
    if (isSuccessUpdate && dataUpdate) {
      refetchOnLoadData();
    }
  }, [isSuccessUpdate, dataUpdate, refetchOnLoadData]);

  //이벤트 이동 기능
  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        mutateUpdate({
          id: existing.id,
          start: formatToOracleDate(start),
          end: formatToOracleDate(end),
        });
        return [...filtered, { ...existing, start, end, allDay }];
      });
    },
    [setMyEvents]
  );

  //새로운 값을 입력할 유즈쿼리문
  const { data: dataSubmit, isSuccess: isSuccessSubmit } = useMutation(
    "submitSchedule",
    submitSchedule
  );

  //DB에 넣을 시간양식 재포맷
  const formatToOracleDate = (jsDateStr) => {
    const date = new Date(jsDateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  //보여줄 시간 양식을 재포맷
  const formatToShowDate = (jsDateStr, startDate, end) => {
    const date = new Date(jsDateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = date.getDay();
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    if (end && date > startDate) {
      const formattedDate = `${month}월 ${day - 1}일 (${week[weekday]}요일)`;
      return formattedDate;
    }
    const formattedDate = `${month}월 ${day}일 (${week[weekday]}요일)`;
    return formattedDate;
  };

  const [onMakeNewEvent, setOnMakeNewEvent] = useState();
  //새로운 이벤트 입력 기능
  const newEvent = useCallback(
    (event, start, end) => {
      setMyEvents((prev) => {
        setOnModal(500);
        setOnMakeNewEvent(event);
        return [...prev];
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
        const filtered = prev.filter((ev) => ev.id !== event.id);
        console.debug("## find start==> ", start);
        console.debug("## find end==> ", end);
        mutateUpdate({
          id: existing.id,
          start: formatToOracleDate(start),
          end: formatToOracleDate(end),
        });
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  const [onSideDate, setOnSideDate] = useState(420);
  const [onEventId, setOnEventId] = useState();
  const [onClickEventData, setOnClickEventData] = useState();
  const openSideMenu = (event) => {
    setOnEventId(event.id);
    if (onSideDate === 0 && event.id === onEventId) setOnSideDate(420);
    else setOnSideDate(0);
    setOnClickEventData(event);
  };
  //이름 클릭했을 때 나오는 얼럿 title id allDay Start 등을 볼 수 있다.
  const handleSelectEvent = useCallback(
    (event) =>
      window.alert(`Title: ${event.title}\nMemo: ${event.meno}\n일정입니다.`),
    []
  );

  return (
    <Container>
      <InputDateModal
        open={onModal}
        close={closeSetOnData}
        newEventData={onMakeNewEvent}
        events={myEvents}
        refetchOnLoadData={refetchOnLoadData}
        onFormatChange={formatToOracleDate}
        formatToShowDate={formatToShowDate}
      />
      <div className="leftArticle">
        <Calendar
          localizer={momentLocalizer(moment)}
          //가져올 이벤트 값
          events={myEvents}
          //이벤트 클릭시 실행 함수
          onSelectEvent={handleSelectEvent}
          selectable
          style={{ height: 380, width: "100%" }}
          components={{ toolbar: ToolbarMini }}
        />
      </div>
      <div className="middleArticle">
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
          onSelectEvent={openSideMenu}
          resizable
          selectable
          style={{ height: "100vh", width: "100%" }}
          components={{ toolbar: Toolbar }}
        />
      </div>
      <div
        className="rightArticle"
        style={{ transform: `translateX(${onSideDate}px)` }}
      >
        <SideUpdatePage
          onData={onClickEventData}
          close={openSideMenu}
          refetchOnLoadData={refetchOnLoadData}
          formatToShowDate={formatToShowDate}
        />
        /
      </div>
    </Container>
  );
};
export default BigCalendarInfo;
