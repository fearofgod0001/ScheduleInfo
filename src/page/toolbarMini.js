export default function MiniToolbar(props) {
  const { date } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  return (
    <div className="rbc-toolbar">
      <span
        className="rbc-btn-group"
        style={{
          width: 200,
          height: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={navigate.bind(null, "PREV")}
          style={{
            width: 30,
            height: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          이전
        </button>
        <span
          style={{ width: 30 }}
          className="rbc-toolbar-label"
        >{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</span>

        <button
          type="button"
          onClick={navigate.bind(null, "NEXT")}
          style={{
            width: 30,
            height: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          다음
        </button>
      </span>
    </div>
  );
}
