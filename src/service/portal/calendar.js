import { callApi } from "../../common/axios/axiosInstance";

export const onLoadData = async () => {
  return await callApi({
    url: "/api/v1/calendar/testselect",
    method: "GET",
    data: { param: {} },
  });
};

export const submit = async (data) => {
  return await callApi({
    url: "/api/v1/calendar/testinputdate",
    method: "POST",
    data: { param: data },
  });
};
