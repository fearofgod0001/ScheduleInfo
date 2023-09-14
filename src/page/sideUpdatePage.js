import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useMutation } from "react-query";
import { deleteSchedule } from "../service/portal/calendar";
import UpdateDateModal from "./updateDateModal";

const Container = styled.div`
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
  box-shadow: 10px 15px 20px;
  .topButton {
    width: 80%;
    display: flex;
    justify-content: end;
  }
  .closeButton {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    border: none;
    font-size: 30px;
    color: #a1a1a1;
    cursor: pointer;
    &:hover {
      color: black;
    }
  }
  .buttonDesign {
    width: 90px;
    height: 30px;
    border-radius: 7px;
    border: none;
    font-size: 15px;
    background-color: #e1e1e1;
    color: #a1a1a1;
    cursor: pointer;
    &:hover {
      background-color: rgba(49, 116, 173);
      color: white;
    }
  }
  .scheduleInfo {
    width: 80%;
    height: 60%;
    .scheduleInfoHead {
      width: 100;
      height: 64px;
      display: flex;
      align-items: center;
      font-size: 34px;
      margin-top: 10px;
      padding-left: 10px;
      background-color: rgba(49, 116, 173);
      color: white;
      border-radius: 10px;
    }
    .scheduleDate {
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      height: 50px;
      border-bottom: 1px solid rgba(49, 116, 173);
      .scheduleInfoDate {
        width: 140px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .todoMemo {
      margin: 20px 0 0 0;
      width: 100%;
    }
  }
  .footerButton {
    width: 80%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
`;

const InputDatePage = (props) => {
  const { close, onData, refetchOnLoadData, formatToShowDate, onFormatChange } =
    props;

  //창을 닫을 컴포넌트
  const onCloseSidePage = () => {
    close(onData);
    setOnModal(0);
  };

  //데이터를 삭제할 쿼리
  const {
    data: dataDelete,
    mutate: mutateDelete,
    isSuccess: isSuccessDelete,
  } = useMutation("deleteSchedule", deleteSchedule);

  //데이터 수정이 완료되면 리패치를 하여 재랜더링 되게 한다.
  useEffect(() => {
    if (isSuccessDelete && dataDelete) {
      refetchOnLoadData();
    }
  }, [isSuccessDelete, dataDelete, refetchOnLoadData]);

  //데이터를 삭제할 컴포넌트
  const DeleteDate = () => {
    mutateDelete({
      id: onData.id,
    });
    close(onData);
  };

  //모달창을 띄울 useState
  const [onModal, setOnModal] = useState(0);

  //모달을 닫을 함수
  const closeSetOnData = () => {
    setOnModal(0);
  };

  //데이터를 수정할 컴포넌트
  const UpdateDate = () => {
    setOnModal(500);
  };

  const [onTitleMemo, setOnTitleMemo] = useState();
  useEffect(() => {
    setOnTitleMemo(onData);
  }, [onData]);

  return (
    <Container>
      <UpdateDateModal
        open={onModal}
        close={closeSetOnData}
        events={onData}
        refetchOnLoadData={refetchOnLoadData}
        onFormatChange={onFormatChange}
        formatToShowDate={formatToShowDate}
        setOnTitleMemo={setOnTitleMemo}
      />
      <div className="topButton">
        <button className="closeButton" onClick={onCloseSidePage}>
          x
        </button>
      </div>
      <div className="scheduleInfo">
        <div className="scheduleInfoHead">
          {onTitleMemo && onTitleMemo.title}
        </div>
        <div className="scheduleDate">
          <div className="scheduleInfoDate">
            {onTitleMemo && formatToShowDate(onTitleMemo.start)}
          </div>

          <div className="scheduleInfoDate">
            {onTitleMemo &&
              formatToShowDate(onTitleMemo.end, onTitleMemo.allday)}
          </div>
        </div>
        <div className="todoMemo">{onTitleMemo && onTitleMemo.memo}</div>
      </div>
      <div className="footerButton">
        <button className="buttonDesign" onClick={DeleteDate}>
          삭제
        </button>
        <button className="buttonDesign" onClick={UpdateDate}>
          수정
        </button>
      </div>
    </Container>
  );
};

export default InputDatePage;
