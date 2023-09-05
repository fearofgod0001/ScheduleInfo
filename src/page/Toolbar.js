export default function Toolbar(props) {
  const { date } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  const onViews = (action) => {
    props.onView(action);
  };

  return (
    <div className="rbc-toolbar">
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
        <span className="rbc-toolbar-label">{`${date.getFullYear()}년 ${
          date.getMonth() + 1
        }월`}</span>
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
