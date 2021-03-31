import { w3cwebsocket as W3CWebSocket } from "websocket";
import WsCommon from "./wsCommon";

class WebSocketClient extends WsCommon {
  constructor(props) {
    super();
    try {
      if (typeof props === "undefined") {
        throw new Error("[WebSocketClient] Error: props are epmty");
      }
      const {
        ws_url,
        api_url,
        access_token,
        target_token,
        debug = false,
      } = props;
      if (typeof api_url !== "undefined") {
        this.api_url = api_url;
      }
      if (typeof ws_url !== "undefined") {
        this.connect(ws_url, access_token, target_token);
        this.debug = debug;
      } else {
        throw new Error("[WebSocketClient] Error: WS URL is empty");
      }
    } catch (error) {
      console.log("[WebSocketClient] Error: ", error);
    }
  }

  connect(ws_url, access_token, target_token) {
    if (typeof this.instance === "undefined") {
      this.createWebSocket(ws_url, access_token, target_token);

      this.instance.addEventListener("open", () => {
        if (this.isReconnecting === true) {
          this.debugConsole("[WebSocketClient] Reconnected");
          this.isReconnecting = false;
          this.emit("reconnected");
          return;
        }
        this.debugConsole("[WebSocketClient] Connected");
        this.emit("connected");
      });

      this.instance.addEventListener("message", ({ data }) => {
        const parsed = JSON.parse(data);
        if (typeof parsed.action !== "undefined") {
          this.emit("received", parsed);
        }
      });

      this.instance.addEventListener("close", (event) => {
        this.debugConsole("[WebSocketClient] Closed");
        this.emit("closed");
        if (event.code !== 1000) {
          this.reconnect(event);
        } else {
          this.emit("closedNormally");
        }
      });

      this.instance.addEventListener("error", (error) => {
        this.debugConsole("[WebSocketClient] Error ", error);
        this.isReconnecting = false;
        this.emit("error");
        this.reconnect();
      });
    }
  }

  disconnect() {
    this.instance.close(1000, "Client closed the connection");
  }

  canIUse() {
    return !!this.instance;
  }

  createWebSocket(ws_url, access_token, target_token) {
    if (typeof ws_url === "string") {
      this.ws_url = ws_url;
    }
    if (typeof access_token === "string") {
      this.access_token = access_token;
    }
    if (typeof target_token === "string") {
      this.target_token = target_token;
    }
    console.log(`${this.ws_url}?access_token=${this.access_token}`);
    this.instance = new W3CWebSocket(
      `${this.ws_url}?access_token=${this.access_token}`,
      "echo-protocol",
      "origin",
      { Authorization: `Bearer ${access_token}` }
    );
  }

  reconnect(event) {
    setTimeout(() => {
      if (this.isReconnecting === true) return;
      this.debugConsole("[WebSocketClient] Reconnecting...");
      this.instance = undefined;
      this.isReconnecting = true;
      this.connect();
    }, 3000);
  }

  sendMessage(message) {
    if (message.type === "file") {
      this.uploadFile(message);
    } else {
      this.instance.send(JSON.stringify(message));
    }
    this.emit("sent");
  }
}

export default WebSocketClient;
