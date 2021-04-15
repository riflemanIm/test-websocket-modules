import WsConsumer from "./models/wsConsumer";
import moment from "moment";
const api_host = "localhost:4000";
const api_protocol = "http";
const api_ws_protocol = "ws";
const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc4NGM1NGQ1ZmZmZjllNzM4M2Q0ZDkiLCJuYW1lIjoic3lzdGVtTm90aWZpY2F0aW9uIiwicGFzc3dvcmQiOiJmYjNmMTM4YTQ4YjczOTg4NmFjYzg2MjMzNjBjMjQ2ZSIsInVzZXJUeXBlIjoib3BlcmF0b3IiLCJmaXJzdE5hbWUiOiJTeXN0ZW0iLCJsYXN0TmFtZSI6Ik5vdGlmaWNhdGlvbiIsImNvbmZlcmVuY2VUb2tlbiI6bnVsbCwiY29uZmVyZW5jZUlkIjoiNjA3ODRjNTRkNWZmZmY5ZTczODNkNGQ5IiwidXNlciI6InN5c3RlbU5vdGlmaWNhdGlvbiIsImlhdCI6MTYxODQ5NzExMH0.pzCduN9KNT5T7j_oLa49hTd--V5_azinkTNwT1kvnrc";
//ws://localhost:4000/api/websocket/?access_token=&target_token=undefined

const targetToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDc4NGM1NGQ1ZmZmZjllNzM4M2Q0ZDIiLCJuYW1lIjoicGF0aWVudDEiLCJwYXNzd29yZCI6IjIwMmNiOTYyYWM1OTA3NWI5NjRiMDcxNTJkMjM0YjcwIiwidXNlclR5cGUiOiJwYXRpZW50IiwiZmlyc3ROYW1lIjoi0J_QtdGC0YAiLCJsYXN0TmFtZSI6ItCh0LzQuNGA0L3QvtCyIiwiY29uZmVyZW5jZVRva2VuIjpudWxsLCJjb25mZXJlbmNlSWQiOiI2MDc4NGM1NGQ1ZmZmZjllNzM4M2Q0ZDIiLCJ1c2VyIjoicGF0aWVudDEiLCJpYXQiOjE2MTg0OTY3OTd9.3YOj0w6AlcyBJhYjgaTHAPgm4GXz3L7tq-mHOLfEL58";
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
