export default function MiniToolbar(props) {
  const { date } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={navigate.bind(null, "PREV")}>
          이전
        </button>
        <span className="rbc-toolbar-label">{`${date.getFullYear()}년 ${
          date.getMonth() + 1
        }월`}</span>
      </span>
      <button type="button" onClick={navigate.bind(null, "NEXT")}>
        다음
      </button>
    </div>
  );
}
