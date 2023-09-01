import axios from "axios";
const RayFul = "http://127.0.0.1:8111";

const Axios = {
  submit: async (user_id, todo_memo, todo_date) => {
    console.log(user_id);
    console.log(todo_memo);
    console.log(todo_date);
    const login = {
      user_id: user_id,
      todo_memo: todo_memo,
      todo_date: todo_date,
    };
    try {
      return await axios.post(RayFul + "/api/v1/calendar/inputdate", login);
    } catch (error) {
      return error.response.this.status;
    }
  },

  onLoadData: async () => {
    try {
      return await axios.get(RayFul + "/api/v1/calendar/scadule");
    } catch (error) {
      return error.response.this.status;
    }
  },
};

export default Axios;
