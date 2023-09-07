import React, { useEffect } from "react";
import { styled } from "styled-components";
import { useMutation } from "react-query";
import { deleteSchedule } from "../service/portal/calendar";

const Container = styled.div`
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: white;
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
  box-shadow: 10px 15px 20px;
  .buttonDesign {
    width: 100px;
    height: 30px;
    border: none;
    font-size: 15px;
    background-color: white;
    cursor: pointer;
    &:hover {
      background-color: rgba(49, 116, 173);
      color: white;
    }
  }
  .scheduleInfo {
    width: 80%;
    height: 70%;
    border: 1px solid #eee;
    .scheduleInfoHead {
      font-size: 40px;
    }
  }
`;

const InputDatePage = (props) => {
  const { onClose, onData, onFormatChange, refetchOnLoadData } = props;

  //창을 닫을 컴포넌트
  const onCloseSidePage = () => {
    onClose(onData);
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
      console.debug("## submit refetch => ", dataDelete);
      console.debug("## submit isSuccessDelete => ", isSuccessDelete);
      refetchOnLoadData();
    }
  }, [isSuccessDelete, dataDelete, refetchOnLoadData]);

  //데이터를 삭제할 컴포넌트
  const DeleteDate = () => {
    mutateDelete({
      id: onData.id,
    });
  };

  //데이터를 수정할 컴포넌트
  const UpdateDate = () => {};

  return (
    <Container>
      <div className="TopButton">
        <button className="buttonDesign" onClick={DeleteDate}>
          삭제
        </button>
        <button className="buttonDesign" onClick={UpdateDate}>
          수정
        </button>
        <button className="buttonDesign" onClick={onCloseSidePage}>
          닫기
        </button>
      </div>
      <div className="scheduleInfo">
        <div className="scheduleInfoHead">{onData && onData.title}</div>
        <div className="scheduleInfoDate">
          start : {onData && onFormatChange(onData.start)}
        </div>
        <div className="scheduleInfoDate">
          end : {onData && onFormatChange(onData.end)}
        </div>
        <div className="todoMemo">memo : {onData && onData.memo}</div>
        <br />
      </div>
    </Container>
  );
};

export default InputDatePage;
