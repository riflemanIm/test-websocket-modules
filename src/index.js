import WsConsumer from "./models/wsConsumer";

const api_host = process.env.REACT_APP_HOST || "10.1.0.182:4000";
const api_protocol = process.env.REACT_APP_SSL === "true" ? "https" : "http";
const api_ws_protocol = process.env.REACT_APP_SSL === "true" ? "wss" : "ws";

const WS_URL = `${api_ws_protocol}://${api_host}/api/websocket/`;
const API_URL = `${api_protocol}://${api_host}/api/v1/`;

const wsClient = new WsConsumer({
  ws_url: WS_URL,
  api_url: API_URL,
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDY0NWNkODhhNTc5Y2Y1MjA0ODRhMjIiLCJuYW1lIjoiZG9jdG9yMSIsInBhc3N3b3JkIjoiMjAyY2I5NjJhYzU5MDc1Yjk2NGIwNzE1MmQyMzRiNzAiLCJ1c2VyVHlwZSI6ImRvY3RvciIsImZpcnN0TmFtZSI6ItCd0LjQutC-0LvQsNC5IiwibGFzdE5hbWUiOiLQotC10YDQtdGF0L7QsiIsImNvbmZlcmVuY2VUb2tlbiI6bnVsbCwiY29uZmVyZW5jZUlkIjoiNjA2NDVjZDg4YTU3OWNmNTIwNDg0YTIyIiwidXNlciI6ImRvY3RvcjEiLCJpYXQiOjE2MTcxOTA3MjJ9.qzHBmNUVT3kYIERKFU7z4wLcxbU0HdpqE0uyxKdy408",
  target_token: undefined,
  debug: true,
});
wsClient.on("connected", () => {
  wsClient.sendNotification("Sended message !!! ");
});
