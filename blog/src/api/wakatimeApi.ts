import axios from 'axios';
const wakatimeApi = axios.create({
  baseURL: "https://wakatime.com",
  // headers: {
  //   'contentType': 'application/x-www-form-urlencoded'
  // }
})

export default wakatimeApi;