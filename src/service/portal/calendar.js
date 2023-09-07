import { callApi } from "../../common/axios/axiosInstance";

export const onLoadData = async () => {
  return await callApi({
    url: "/api/v1/calendar/testselect",
    method: "GET",
    data: { param: {} },
  });
};

export const submitSchedule = async (data) => {
  return await callApi({
    url: "/api/v1/calendar/testinputdate",
    method: "POST",
    data: { param: data },
  });
};

export const updateSchedule = async (data) => {
  return await callApi({
    url: "/api/v1/calendar/testupdatedate",
    method: "POST",
    data: { param: data },
  });
};

export const deleteSchedule = async (data) => {
  return await callApi({
    url: "/api/v1/calendar/testdeletedate",
    method: "POST",
    data: { param: data },
  });
};
