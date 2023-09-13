import styled from "styled-components";

const Container = styled.div`
  button {
    border: none;
    width: 30px;
    height: 20px;
    font-weight: 900;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default function MiniToolbar(props) {
  const { date } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  return (
    <Container>
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
          <button onClick={navigate.bind(null, "PREV")}>＜</button>
          <span
            style={{ width: 30 }}
            className="rbc-toolbar-label"
          >{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</span>

          <button onClick={navigate.bind(null, "NEXT")}>＞</button>
        </span>
      </div>
    </Container>
  );
}
