import WsConsumer from "./models/wsConsumer";
import moment from "moment";
const api_host = "demo.mediadoc.fr";
const api_protocol = "https";
const api_ws_protocol = "wss";
const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc4NmVjZmJhZjkxMTQ3NWNlOWVlZGMiLCJuYW1lIjoic3lzdGVtTm90aWZpY2F0aW9uIiwicGFzc3dvcmQiOiJmYjNmMTM4YTQ4YjczOTg4NmFjYzg2MjMzNjBjMjQ2ZSIsInVzZXJUeXBlIjoib3BlcmF0b3IiLCJmaXJzdE5hbWUiOiJTeXN0ZW0iLCJsYXN0TmFtZSI6Ik5vdGlmaWNhdGlvbiIsImNvbmZlcmVuY2VUb2tlbiI6bnVsbCwiY29uZmVyZW5jZUlkIjoiNjA3ODZlY2ZiYWY5MTE0NzVjZTllZWRjIiwidXNlciI6InN5c3RlbU5vdGlmaWNhdGlvbiIsImlhdCI6MTYxODUwNTYzOH0.E3mP4y7gasD-q_5iDiiqv9o4ScknzN70B91RF8SAHeY";
//ws://localhost:4000/api/websocket/?access_token=&target_token=undefined

const targetToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDY2ZDQxOGFhZDM5MzFhMGQyMjQ0MTMiLCJuYW1lIjoicGF0aWVudDEiLCJwYXNzd29yZCI6IjIwMmNiOTYyYWM1OTA3NWI5NjRiMDcxNTJkMjM0YjcwIiwidXNlclR5cGUiOiJwYXRpZW50IiwiZmlyc3ROYW1lIjoi0J_QtdGC0YAiLCJsYXN0TmFtZSI6ItCh0LzQuNGA0L3QvtCyIiwiY29uZmVyZW5jZVRva2VuIjpudWxsLCJjb25mZXJlbmNlSWQiOiI2MDY2ZDQxOGFhZDM5MzFhMGQyMjQ0MTMiLCJ1c2VyIjoicGF0aWVudDEiLCJpYXQiOjE2MTg1MDU3MDB9.iWh-PS1tYF1hVUeN786Ik_FYLqHL6CEmQ7dFvLFI3dc";
const WS_URL = `${api_ws_protocol}://${api_host}/api/websocket/`;
const API_URL = `${api_protocol}://${api_host}/api/v1/`;

const wsClient = new WsConsumer({
  ws_url: WS_URL,
  api_url: API_URL,
  access_token,
  debug: true,
});
wsClient.on("connected", () => {
  wsClient.sendNotification({
    textNote: "Sended message !!! ",
    dateExp: moment().add(11, "minutes"),
  });
  wsClient.sendMessage({
    text: ` Конференция начнется  ${moment().add(11, "minutes")} !!! `,
    files: [],
    targetToken,
  });
});
// wsClient.on("notificationReceived", (data) => {
//   console.log("notificationReceived", data);
//   //store.dispatch(fetchChatUsersSuccess(data));
// });
wsClient.on("error", (data) => {
  console.log("error", data);
});
