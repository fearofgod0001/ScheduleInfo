import React, { useState, useEffect, useContext } from "react";
import { styled } from "styled-components";
import { Calendar } from "antd";
import { UserContext } from "../context/contextApi";
import InputDataModal from "./inputDataModal";
import locale from "antd/es/calendar/locale/ko_KR";
import { useQuery } from "react-query";
import { onLoadData } from "../service/portal/calendar";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &::-webkit-scrollbar {
    display: none;
  }
  .todo {
    display: flex;
    flex-direction: column;
    background-color: aliceblue;
    font-size: 11px;
    overflow-x: hidden;
  }
  .todoUserId {
    width: 100%;
    height: 12px;
    font-size: 10px;
    font-weight: bolder;
  }
  .todoMemo {
    width: 100%;
    height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .ant-picker-calendar-date-content {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const CalndarInfo = () => {
  //날짜를 저장할 context
  const context = useContext(UserContext);
  const { setCalDate, onData, setOnData } = context;
  //모달창을 띄울 useState
  const [onModal, setOnModal] = useState(false);
  //모달을 닫을 함수
  const closeSetOnData = () => {
    setOnModal(false);
  };

  const { data } = useQuery("onLoadData", onLoadData);
  console.log(data);

  //웹브라우저가 랜더링 될 때 실행할 함수
  useEffect(() => {
    setOnData(data);
  }, [data]);

  //달력을 선택하면 실행 될 함수
  const onSelectDateCell = (value) => {
    setOnModal(true);
    // console.log(value);
    //날짜양식 yyyy-mm-dd로 맞추기
    const monthData = String(value.$M + 1).padStart(2, "0");
    const dayData = String(value.$D).padStart(2, "0");
    setCalDate(value.$y + "-" + monthData + "-" + dayData);
  };

  //달력에서 받아오는 값과 데이터에서 가져오는 값을 비교함.
  const onCellRender = (value) => {
    //날짜양식 yyyy-mm-dd로 맞추기
    const monthData = String(value.$M + 1).padStart(2, "0");
    const dayData = String(value.$D).padStart(2, "0");
    const valueData = value.$y + "-" + monthData + "-" + dayData;
    // console.log("쎌렌더 : ", valueData);

    //받아온 데이터(onData)와 달력에 랜더링 되는 날짜(valueData)를 비교하여 값을 만든다.
    //여러개 todo를 받을 배열
    const matchingTodos = [];
    //onData에는 전체 일정을 받아올 수 있다.
    for (let i in onData) {
      if (valueData === onData[i].todo_date) {
        //배열에 넣어준다.
        matchingTodos.push(
          <div className="todo" key={onData[i].calender_id}>
            <div className="todoUserId">{onData[i].user_id}</div>
            <div className="todoMemo">{onData[i].todo_memo}</div>
          </div>
        );
      }
    }
    return <div>{matchingTodos}</div>;
  };

  const checkValue = (e) => {
    console.log(e);
  };
  return (
    <Container>
      {onModal === true && (
        <InputDataModal open={onModal} close={closeSetOnData} />
      )}
      <Calendar
        onSelect={onSelectDateCell}
        cellRender={onCellRender}
        locale={locale}
        onPanelChange={checkValue}
      />
    </Container>
  );
};

export default CalndarInfo;
