import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
  .sideOtherCal {
    margin-left: 20px;
    width: 50%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: 0.3s ease-in-out;
  }
`;
const SideOtherCalPage = () => {
  const sampleCal = [
    { name: "대한민국 휴일" },
    { name: "회사 휴일" },
    { name: "사원 일정" },
  ];

  const [openSide, setOpenSide] = useState(100);
  const openSideCal = () => {
    if (openSide === 100) setOpenSide(0);
    else setOpenSide(100);
  };

  return (
    <Container>
      다른 캘린더 일정 <button onClick={openSideCal}>ㄱ</button>
      <div className="sideOtherCal" style={{ height: openSide }}>
        {sampleCal.map((e) => (
          <div>
            <input type="checkbox"></input> <button>{e.name}</button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default SideOtherCalPage;
