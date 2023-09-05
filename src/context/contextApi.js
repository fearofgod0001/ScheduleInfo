import { createContext, useState } from "react";
export const UserContext = createContext("");

const ContentsStore = (props) => {
  //캘린더에서 가져오는 날짜 값
  const [calDate, setCalDate] = useState("");
  return (
    <UserContext.Provider
      value={{
        calDate,
        setCalDate,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default ContentsStore;
