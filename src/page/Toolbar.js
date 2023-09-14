import styled from "styled-components";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Container = styled.div`
  button {
    border: none;
  }
  .rbc-toolbar {
    display: flex;
    justify-content: center;
    margin: 10px 0px 10px 0px;

    .rbc-toolbar-label {
      font-size: 25px;
      font-weight: bolder;
    }
  }
`;

export default function Toolbar(props) {
  const { date } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  const onViews = (action) => {
    props.onView(action);
  };
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <Container>
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button onClick={navigate.bind(null, "PREV")}>＜</button>
          <button onClick={navigate.bind(null, "TODAY")}>TODAY</button>
          <button onClick={navigate.bind(null, "NEXT")}> ＞</button>
        </span>
        <span className="rbc-toolbar-label">
          {props.view === "month" &&
            `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
          {props.view === "week" &&
            `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
          {props.view === "day" &&
            `${date.getMonth() + 1}월 ${date.getDate()}일 ${
              week[date.getDay()]
            }요일`}
        </span>
        <span className="rbc-btn-group">
          <button onClick={onViews.bind(null, "month")}>월</button>
          <button onClick={onViews.bind(null, "week")}>주</button>
          <button onClick={onViews.bind(null, "day")}>일</button>
          <button onClick={onViews.bind(null, "agenda")}>아젠다</button>
        </span>
      </div>
    </Container>
  );
}
