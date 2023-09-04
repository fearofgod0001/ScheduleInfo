import React, { useState, useContext } from "react";
import { styled } from "styled-components";
import { UserContext } from "../context/contextApi";
import { useMutation } from "react-query";
import { submit } from "../service/portal/calendar";
import { useQuery } from "react-query";
import { onLoadData } from "../service/portal/calendar";

const Container = styled.div`
  position: absolute;
  z-index: 100;
  .modal {
    width: 250px;
    height: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    animation: modal-bg-show 0.8s;
    .exitButton {
      position: absolute;
      top: -0.1rem;
      left: 14.8rem;
      color: #ccc;
      cursor: pointer;
      &:hover {
        color: black;
      }
    }
    .infoTitle {
      color: rgba(15, 111, 255);
      font-size: 14px;
    }
    .userId {
      width: 88%;
      border: none;
      border-bottom: 2px solid rgba(22, 119, 255);
      &::placeholder {
        font-size: 11px;
        color: #ccc;
      }
      &:focus {
        outline: none;
      }
    }
    .todoMemo {
      width: 88%;
      height: 70%;
      border: none;
      resize: none;
      &:focus {
        outline: 1.2px solid #ccc;
        border-radius: 2px;
      }
      &::placeholder {
        font-size: 11px;
        color: #ccc;
      }
    }
    .submitButton {
      width: 100%;
      height: 9%;
      background-color: white;
      border: none;
      &:hover {
        background-color: rgba(230, 244, 255);
        color: blue;
      }
    }
  }
`;

const InputDataModal = (props) => {
  //부모로 받을 props값
  const { close } = props;
  //날짜를 저장할 context
  const context = useContext(UserContext);
  const { calDate, setOnData } = context;
  //유저의 정보와 값을 담을 useState
  const [userId, setUserId] = useState();
  const [userMemo, setUserMemo] = useState();

  const onChageUserId = (e) => {
    setUserId(e.target.value);
  };
  const onChageMemo = (e) => {
    setUserMemo(e.target.value);
  };

  const sendData = useMutation("submit", submit);
  const onSubmit = () => {
    sendData.mutate({
      user_id: userId,
      todo_memo: userMemo,
      todo_date: calDate,
    });
    close();
  };

  return (
    <Container>
      <div className="modal">
        <div className="exitButton" onClick={close}>
          ×
        </div>
        <div className="infoTitle">{calDate}</div>
        <input
          type="text"
          className="userId"
          placeholder="유저 id 를 입력하세요"
          value={userId || ""}
          onChange={onChageUserId}
        />
        <textarea
          className="todoMemo"
          placeholder="내용을 입력하세요"
          value={userMemo}
          onChange={onChageMemo}
        />
        <button className="submitButton" onClick={onSubmit}>
          확인
        </button>
      </div>
    </Container>
  );
};
export default InputDataModal;
