import "./App.css";
import ContentsStore from "./context/contextApi";
import CalndarInfo from "./page/calender";
import BigCalendarInfo from "./page/bigCalendar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { message } from "antd";
import { RecoilRoot } from "recoil";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // suspense: true,
        refetchOnWindowFocus: false,
        retry: 0,
        onSettled: (data, error) => {
          if (error) {
            message.error(error.errorMsg);
          }
        },
      },
      mutations: {
        onSettled: (data, error) => {
          if (error) {
            message.error(error.errorMsg);
          }
        },
      },
    },
  });
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ContentsStore>
          <Router>
            <Routes>
              <Route path="/" element={<CalndarInfo />} />
              <Route path="/bigcalendar" element={<BigCalendarInfo />} />
            </Routes>
          </Router>
        </ContentsStore>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
