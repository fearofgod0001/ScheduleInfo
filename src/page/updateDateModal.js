import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useMutation } from "react-query";
import { updateSchedule } from "../service/portal/calendar";

const UpdateModalContainer = styled.div`
  position: fixed;
  top: 30%;
  right: 110%;
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

const UpdateDateModal = (props) => {
  const {
    open,
    close,
    events,
    refetchOnLoadData,
    onFormatChange,
    formatToShowDate,
    setOnTitleMemo,
  } = props;

  useEffect(() => {
    events && setEventTitle(events.title);
    events && setEventMemo(events.memo);
  }, [events]);

  const [eventTitle, setEventTitle] = useState();
  const [eventMemo, setEventMemo] = useState();
  //제목을 입력
  const onEventTitle = (e) => {
    setEventTitle(e.target.value);
  };
  //메모를 입력
  const onEventMemo = (e) => {
    setEventMemo(e.target.value);
  };

  //새로운 값을 입력할 유즈쿼리문
  const {
    data: dataUpdate,
    mutate: mutateUpdate,
    isSuccess: isSuccessUpdate,
  } = useMutation("updateSchedule", updateSchedule);

  //데이터 수정이 완료되면 리패치를 하여 재랜더링 되게 한다.
  useEffect(() => {
    if (isSuccessUpdate && dataUpdate) {
      refetchOnLoadData();
      //부모 페이지로 보낼 새로운 업데이트 데이터
      setOnTitleMemo(dataUpdate.param);
      close();
    }
  }, [isSuccessUpdate, dataUpdate, refetchOnLoadData]);

  //event를 db에 넣어줄 mutation
  const onUpdateEventData = () => {
    mutateUpdate({
      id: events.id,
      title: eventTitle,
      start: onFormatChange(events.start),
      end: onFormatChange(events.end),
      allday: events.allday,
      memo: eventMemo,
    });
  };

  return (
    <UpdateModalContainer style={{ height: open }}>
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
          <button className="setDate">
            {events && formatToShowDate(events.start)}
          </button>
          <button className="setDate">
            {events && formatToShowDate(events.end)}
          </button>
        </div>
        <textarea
          className="inputTextArea"
          placeholder="내용을 입력하세요"
          value={eventMemo}
          onChange={onEventMemo}
        ></textarea>
      </div>
      <div className="inputModalFooter">
        <button className="modalSubmit" onClick={onUpdateEventData}>
          저장
        </button>
      </div>
    </UpdateModalContainer>
  );
};

export default UpdateDateModal;
