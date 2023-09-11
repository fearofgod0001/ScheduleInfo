import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { submitSchedule } from "../service/portal/calendar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import ToolbarMini from "./toolbarMini";
import { useMutation } from "react-query";

const InputModalContainer = styled.div`
  position: fixed;
  top: 30%;
  left: 38%;
  width: 400px;
  z-index: 150;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  border-radius: 7px;
  box-shadow: 5px 5px 30px #aaa;
  overflow: hidden;
  transition: 0.3s ease-out;
  .inputModalHead {
    display: flex;
    width: 100%;
    height: 40px;
    background-color: #eee;
    border-top-right-radius: 7px;
    border-top-left-radius: 7px;
    justify-content: end;
    .modalClose {
      margin-right: 5px;
      border: none;
      font-weight: bolder;
      border-top-right-radius: 7px;
      color: #a1a1a1;
      cursor: pointer;
      &:hover {
        color: black;
      }
    }
  }
  .changeDate {
    width: 90%;
    height: 10%;
    display: flex;
    justify-content: space-evenly;
    .setDate {
      width: 170px;
      border: none;
      border-radius: 7px;
      background-color: white;
      &:hover {
        background-color: #eee;
      }
      &:active {
        background-color: rgba(49, 116, 173);
        color: white;
      }
    }
  }
  .inputModalBody {
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    .inputTitle {
      margin-top: 4px;
      width: 90%;
      height: 40px;
      border: none;
      border-bottom: 1px solid #ccc;
      font-size: 20px;
      &::placeholder {
        font-size: 20px;
      }
      &:focus {
        outline: none;
        border-bottom: 3px solid rgba(49, 116, 173);
        transition: 0.1s ease-in;
      }
    }
    .inputCalendar {
      position: absolute;
      top: 9rem;
      transition: ease-in 0.2s;
      overflow: hidden;
      border-radius: 6px;
      box-shadow: 0px 0px 20px #ccc;
    }
    .inputTextArea {
      width: 90%;
      height: 70%;
      border: 1px solid #ccc;
      border-radius: 7px;
      resize: none;
      font-size: 15px;
      padding: 5px 0 0 5px;
      &:focus {
        outline: none;
        border: 1px solid rgba(49, 116, 173);
        transition: 0.8s ease-in;
      }
    }
  }
  .inputModalFooter {
    width: 100%;
    height: 13%;
    border-bottom-right-radius: 7px;
    border-bottom-left-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: end;
    .modalSubmit {
      width: 80px;
      height: 40px;
      border-radius: 5px;
      border: none;
      background-color: rgba(49, 116, 173);
      color: white;
      margin-right: 10px;
    }
  }
`;

const InputDateModal = (props) => {
  const {
    open,
    close,
    newEventData,
    events,
    refetchOnLoadData,
    onFormatChange,
    formatToShowDate,
  } = props;
  //   console.log(newEventData);
  //미니 캘린더의 크기를 조절할 스테이트
  const [onCalendar, setOnCalendar] = useState(0);
  const onOpenCalendar = () => {
    if (onCalendar === 0) setOnCalendar(230);
    else setOnCalendar(0);
  };

  const [eventTitle, setEventTitle] = useState();
  const [eventMemo, setEventMemo] = useState();
  const onEventTitle = (e) => {
    setEventTitle(e.target.value);
  };
  const onEventMemo = (e) => {
    setEventMemo(e.target.value);
  };

  //새로운 값을 입력할 유즈쿼리문
  const {
    data: dataSubmit,
    mutate: mutateSubmit,
    isSuccess: isSuccessSubmit,
  } = useMutation("submitSchedule", submitSchedule);

  const onSubmitEventData = () => {
    mutateSubmit({
      title: eventTitle,
      start: onFormatChange(newEventData.slots[0]),
      end: onFormatChange(newEventData.slots[newEventData.slots.length - 1]),
      memo: eventMemo,
    });
  };

  //데이터 입력이 완료되면 리패치를 하여 재랜더링 되게 한다.
  useEffect(() => {
    if (isSuccessSubmit && dataSubmit) {
      console.debug("## submit refetch => ", dataSubmit);
      refetchOnLoadData();
      close();
      setEventTitle("");
      setEventMemo("");
    }
  }, [isSuccessSubmit, dataSubmit, refetchOnLoadData]);

  const [handleDate, setHandleDate] = useState();
  const handleDateChange = (date) => {
    console.log(formatToShowDate(date));
    setHandleDate(formatToShowDate(date));
    onOpenCalendar(0);
  };

  return (
    <InputModalContainer style={{ height: open }}>
      <div className="inputModalHead">
        <button className="modalClose" onClick={close}>
          닫기
        </button>
      </div>
      <div className="inputModalBody">
        <input
          type="text"
          className="inputTitle"
          placeholder="제목을 입력하세요"
          value={eventTitle || ""}
          onChange={onEventTitle}
        ></input>
        <div className="changeDate">
          <button className="setDate" onClick={onOpenCalendar}>
            {newEventData && formatToShowDate(newEventData.slots[0])}
          </button>
          <button className="setDate" onClick={onOpenCalendar}>
            {newEventData &&
              formatToShowDate(
                newEventData.slots[newEventData.slots.length - 1]
              )}
          </button>
        </div>
        <div className="inputCalendar" style={{ height: onCalendar }}>
          <Calendar
            localizer={momentLocalizer(moment)}
            events={events}
            onNavigate={handleDateChange}
            selectable
            view="month"
            style={{
              backgroundColor: "white",
              height: 230,
              width: 280,
            }}
            components={{ toolbar: ToolbarMini }}
          />
        </div>

        <textarea
          className="inputTextArea"
          placeholder="내용을 입력하세요"
          value={eventMemo}
          onChange={onEventMemo}
        ></textarea>
      </div>
      <div className="inputModalFooter">
        <button className="modalSubmit" onClick={onSubmitEventData}>
          저장
        </button>
      </div>
    </InputModalContainer>
  );
};

export default InputDateModal;
