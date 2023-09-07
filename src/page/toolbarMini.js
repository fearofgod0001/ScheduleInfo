export default function MiniToolbar(props) {
  const { date } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button
          type="button"
          onClick={navigate.bind(null, "PREV")}
          style={{ width: 30, height: 10 }}
        ></button>
        <span
          style={{ width: 30, height: 10 }}
          className="rbc-toolbar-label"
        >{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</span>
      </span>
      <button
        type="button"
        onClick={navigate.bind(null, "NEXT")}
        style={{ width: 30, height: 10 }}
      ></button>
    </div>
  );
}
