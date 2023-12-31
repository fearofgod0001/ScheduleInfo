import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Toolbar from "./Toolbar";
import ToolbarMini from "./toolbarMini";
import InputDateModal from "./inputDateModal";
import SideUpdatePage from "./sideUpdatePage";
import SideOtherCalPage from "./sideOtherCalPage";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { styled } from "styled-components";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { onLoadData } from "../service/portal/calendar";
import { submitSchedule } from "../service/portal/calendar";
import { updateSchedule } from "../service/portal/calendar";
const Container = styled.div`
  display: flex;
  overflow: hidden;
  .rbc-date-cell {
    text-align: center;
  }
  .leftArticle {
    min-width: 330px;
    height: 100vh;
    display: flex;
    justify-content: center;
    .calManagement {
      width: 90%;
      height: 57%;
    }
    .rbc-month-view {
      height: 100px;
      border: none;
    }
    .rbc-day-bg.rbc-today {
      background-color: white;
    }
    .rbc-month-row {
      border: none;
      .rbc-row-bg {
        height: 44px;
      }
    }

    .rbc-day-bg {
      border: none;
    }
    .rbc-date-cell.rbc-now,
    .rbc-date-cell.rbc-date-cell.rbc-now.rbc-current {
      .rbc-button-link {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: rgba(49, 116, 173);
        color: white;
      }
    }
    .rbc-date-cell.rbc-current {
      .rbc-button-link {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: rgba(49, 116, 173, 0.5);
        color: white;
      }
    }
  }
  .middleArticle {
    width: 100%;
    height: 100%;

    .rbc-row.rbc-month-header {
      height: 40px;
      display: flex;
      align-items: center;
      .rbc-header {
        border-bottom: none;
      }
    }
    .rbc-day-bg.rbc-today {
      background-color: white;
    }
    .rbc-date-cell {
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: end;
    }
    .rbc-event.rbc-event-allday {
      width: 100%;
    }
    .rbc-date-cell.rbc-now {
      .rbc-button-link {
        width: 25px;
        height: 25px;
        box-shadow: 0 0 5px #aaa;
        border-radius: 50%;
        background-color: rgba(49, 116, 173);
        color: white;
      }
    }
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
      margin-top: 10px;
    }
    .rbc-addons-dnd-drag-row {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .rbc-day-bg {
      &:hover {
        background-color: #eee;
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
      width: 100%;
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

  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);

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
  const [myEvents, setMyEvents] = useState();
  //모달창을 띄울 useState
  const [onModal, setOnModal] = useState(0);
  //모달을 닫을 함수
  const closeSetOnData = () => {
    setOnModal(0);
  };

  //쿼리가 발생하면 데이터를 받아서 이벤트를 가져온다.
  useEffect(() => {
    if (dataOnLoadData) {
      const adjEvents = Object.values(dataOnLoadData).map((data) => ({
        ...data,
        start: formatToJSDate(data.start),
        end: formatToJSDate(data.end),
      }));
      setMyEvents(adjEvents);
    }
  }, [dataOnLoadData]);

  //값을 업데이트할 유즈쿼리문
  const {
    data: dataUpdate,
    mutate: mutateUpdate,
    isSuccess: isSuccessUpdate,
  } = useMutation("updateSchedule", updateSchedule);

  //데이터 수정이 완료되면 리패치를 하여 재랜더링 되게 한다.
  useEffect(() => {
    if (isSuccessUpdate && dataUpdate) {
      refetchOnLoadData();
      setOnClickEventData(dataUpdate.param);
    }
  }, [isSuccessUpdate, dataUpdate, refetchOnLoadData]);

  //이벤트 이동 기능
  const moveEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        mutateUpdate({
          id: existing.id,
          title: event.title,
          allday: event.allday,
          start: formatToOracleDate(start),
          end: formatToOracleDate(end),
          memo: event.memo,
        });
        return [...filtered, { ...existing, start, end }];
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
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const formattedDate = `${year}-${month}-${day} ${hour}:${minutes}`;
    return formattedDate;
  };

  //보여줄 시간 양식을 재포맷
  const formatToShowDate = (jsDateStr) => {
    const date = new Date(jsDateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = date.getDay();
    let hours = "";
    const minutes = date.getMinutes();
    let pmAm = "PM";
    date.getHours() > 12
      ? (hours = date.getHours() - 12)
      : (hours = date.getHours());
    date.getHours() > 12 ? (pmAm = "PM") : (pmAm = "AM");
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const formattedDate = (
      <div>
        <span>
          {month}월 {day}일 ({week[weekday]}요일)
        </span>
        <br />
        <span className="hoursMinutes">
          {pmAm} {hours} : {minutes}
        </span>
      </div>
    );
    return formattedDate;
  };

  const [onMakeNewEvent, setOnMakeNewEvent] = useState();
  //새로운 이벤트 입력 기능
  const newEvent = useCallback(
    (event) => {
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
        mutateUpdate({
          id: existing.id,
          title: event.title,
          allday: event.allday,
          start: formatToOracleDate(start),
          end: formatToOracleDate(end),
          memo: event.memo,
        });
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  const [onSideDate, setOnSideDate] = useState(420);
  const [onEventId, setOnEventId] = useState();
  const [onClickEventData, setOnClickEventData] = useState();
  //사이드 메뉴를 열고 닫음
  const openSideMenu = (event) => {
    console.log(event);
    setOnEventId(event.id);
    if (onSideDate === 0 && event.id === onEventId) setOnSideDate(420);
    else setOnSideDate(0);
    setOnClickEventData(event);
  };

  //클릭한 날짜의 정보를 받아옴
  const [handleDate, setHandleDate] = useState();
  const handleDateChange = (date) => {
    console.log(date);
    setHandleDate(date);
  };
  //클릭한 view의 정보를 받아옴
  const [currentView, setCurrentView] = useState();
  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  //user id값을 받아와서 다른 캘린더의 정보를 받아올 때 컬러를 변경하도록한다.
  const eventPropGetter = useCallback(
    (event) => ({
      ...(event.allday != "0"
        ? { style: { backgroundColor: "#616264" } }
        : { style: {} }),
    }),
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
          localizer={localizer}
          style={{ width: "90%", height: 280 }}
          components={{ toolbar: ToolbarMini }}
          view="month"
          //클릭한 date날짜를 가져옴
          onNavigate={handleDateChange}
          //클릭 한 view 의 유형을 가져옴
          onView={handleViewChange}
        />
      </div>
      <div className="middleArticle">
        <DragAndDropCalendar
          //시간 현지화
          localizer={localizer}
          //가져올 이벤트 값
          events={myEvents}
          //위치 재정의
          onEventDrop={moveEvent}
          //사이즈 재정의
          onEventResize={resizeEvent}
          //새로운 이벤트 생성 함수
          onSelectSlot={newEvent}
          //이벤트 클릭시 실행 함수
          onSelectEvent={openSideMenu}
          // onNavigate 에서 가져온 값으로 현재 날짜를 바꿈
          date={handleDate}
          //이번달 이전 다음 에서 가져올 값들
          onNavigate={handleDateChange}
          // view를 바꿀 함수 toolbar에 있는 모든 값을 받을 수 있다.
          onView={handleViewChange}
          //보여질 화면
          view={currentView}
          //이벤트 발생할 때마다
          eventPropGetter={eventPropGetter}
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
          onFormatChange={formatToOracleDate}
        />
        /
      </div>
    </Container>
  );
};
export default BigCalendarInfo;
