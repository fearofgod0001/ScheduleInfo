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
    <div
      className="rbc-toolbar"
      style={{ display: "flex", justifyContent: "space-evenly" }}
    >
      <span className="rbc-btn-group">
        <button type="button" onClick={navigate.bind(null, "TODAY")}>
          이번달
        </button>
        <button type="button" onClick={navigate.bind(null, "PREV")}>
          이전
        </button>
        <button type="button" onClick={navigate.bind(null, "NEXT")}>
          다음
        </button>
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
        <button type="button" onClick={onViews.bind(null, "month")}>
          월
        </button>
        <button type="button" onClick={onViews.bind(null, "week")}>
          주
        </button>
        <button type="button" onClick={onViews.bind(null, "day")}>
          일
        </button>
        <button type="button" onClick={onViews.bind(null, "agenda")}>
          아젠다
        </button>
      </span>
    </div>
  );
}
