import { callApi } from "../../api/axiosInstance";

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
