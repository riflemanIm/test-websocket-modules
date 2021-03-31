import WsCommon from "./wsCommon";
import WebSocketClient from "./wsConnection";

class WebSocketConsumer extends WsCommon {
  constructor(props) {
    super();
    try {
      if (typeof props === "undefined") {
        throw new Error("WebSocketConsumer Error: props are empty");
      }
      const {
        ws_url,
        api_url,
        access_token,
        target_token,
        debug = false,
      } = props;
      if (
        typeof ws_url !== "undefined" &&
        typeof access_token !== "undefined"
      ) {
        this.wsClient = new WebSocketClient({
          ws_url,
          api_url,
          access_token,
          target_token,
          debug,
        });
        this.debug = debug;
        this.subscribe();
      } else {
        throw new Error(
          "WebSocketConsumer Error: ws_url or access_token  is empty"
        );
      }
    } catch (error) {
      console.log("WebSocketConsumer Error: ", error);
    }
  }

  requestId = 0;

  subscribe() {
    this.wsClient.on("connected", (event) => this.emit("connected", event));
    this.wsClient.on("closed", (event) => this.emit("closed", event));
    this.wsClient.on("closedNormally", (event) =>
      this.emit("closedNormally", event)
    );
    this.wsClient.on("reconnected", (event) => this.emit("reconnected", event));
    this.wsClient.on("received", (event) => {
      this.onMessageReceived(event);
      this.emit("received", event);
    });

    this.wsClient.on("fileUploadProgress", ({ requestId, event }) => {
      this.emit("fileUploadProgress", {
        requestId,
        percent: event.loaded / event.total,
      });
    });

    this.wsClient.on("fileUploadError", (event) => {
      this.emit("fileUploadError", event);
    });

    this.wsClient.on("fileUploadSuccess", (event) => {
      this.emit("fileUploadSuccess", event);
    });
  }

  onMessageReceived(message) {
    if (typeof message === "object" && typeof message.action === "string") {
      this.parseInboxAction(message);
    }
  }

  sendMessage({ text, files, requestId, targetToken }) {
    this.parseOutgoingAction({
      action: "SEND_MESSAGE",
      payload: { text, files, requestId, targetToken },
    });
  }

  uploadFile({ file, requestId }) {
    this.parseOutgoingAction({
      action: "UPLOAD_FILE",
      payload: { file, requestId },
      type: "file",
    });
  }

  getMessages(payload) {
    this.parseOutgoingAction({ action: "GET_MESSAGES", payload });
  }

  deleteMessages(payload) {
    this.parseOutgoingAction({ action: "DELETE_MESSAGES", payload });
  }

  editMessage(payload) {
    this.parseOutgoingAction({ action: "EDIT_MESSAGE", payload });
  }

  markMessagesAsReceived(id) {
    this.parseOutgoingAction({
      action: "MARK_MESSAGES",
      payload: { id, status: "received" },
    });
  }

  markMessagesAsRead(id) {
    this.parseOutgoingAction({
      action: "MARK_MESSAGES",
      payload: { id, status: "read" },
    });
  }

  getConferenceStatus(payload) {
    this.parseOutgoingAction({ action: "GET_CONFERENCE_STATUS", payload });
  }

  setConferenceActive(payload) {
    this.parseOutgoingAction({ action: "SET_CONFERENCE_ACTIVE", payload });
  }

  setConferenceStop(payload) {
    this.parseOutgoingAction({ action: "SET_CONFERENCE_STOP", payload });
  }

  getConferenceUrl(payload) {
    this.parseOutgoingAction({ action: "GET_CONFERENCE_URL", payload });
  }

  getChatRooms(payload) {
    this.parseOutgoingAction({ action: "GET_CHAT_ROOMS", payload });
  }

  setTyping(payload) {
    this.parseOutgoingAction({ action: "SET_TYPING", payload });
  }

  getUsers(payload) {
    this.parseOutgoingAction({ action: "GET_USERS", payload });
  }

  sendNotification(payload) {
    this.parseOutgoingAction({ action: "SEND_NOTIFICATION", payload });
  }

  disconnect() {
    this.wsClient.disconnect();
  }

  // -------------------

  parseInboxAction({ action, payload }) {
    if (typeof this.inboxActions[action] === "function") {
      this.inboxActions[action](payload);
    }
  }

  parseOutgoingAction(data) {
    try {
      if (this.validateOutgoindData(data)) {
        this.wsClient.sendMessage(data);
      } else {
        throw new Error("Bad action identifier");
      }
    } catch (error) {
      this.debugConsole(
        "[WsConsumer] Error: Outgoing actions parsing failed: Bad action identifier ",
        error.message,
        data
      );
    }
  }

  inboxActions = {
    REQUEST_FAILED: (payload) => {
      this.emit("requestFailed", payload);
    },
    SET_ACTIVE: (payload) => {
      this.emit("chatActivated", payload);
    },
    SET_MESSAGES: (payload) => {
      this.emit("messagesReceived", payload);
    },
    MESSAGE_SENT: (payload) => {
      this.emit("messageSent", payload);
    },
    MESSAGE_SENT_ERROR: (payload) => {
      this.emit("messageSentError", payload);
    },
    MESSAGE_UPDATES: (payload) => {
      this.emit("messageUpdated", payload);
    },
    MESSAGES_UPDATES: (payload) => {
      this.emit("messagesUpdated", payload);
    },
    MESSAGES_DELETED: (payload) => {
      this.emit("messagesDeleted", payload);
    },
    MESSAGES_MARKED: (payload) => {
      this.emit("messagesMarked", payload);
    },
    CONFERENCE_STATUS_UPDATED: (payload) => {
      this.emit("conferenceStatusUpdated", payload);
    },
    CONFERENCE_URL_UPDATED: (payload) => {
      this.emit("conferenceUrlUpdated", payload);
    },
    SET_CHAT_ROOMS: (payload) => {
      this.emit("chatRoomsReceived", payload);
    },
    RECEIVED_TYPING: (payload) => {
      this.emit("typingReceived", payload);
    },
    USERS_RECEIVED: (payload) => {
      this.emit("usersReceived", payload);
    },
    RECEIVED_NOTIFICATION: (payload) => {
      this.emit("notificationReceived", payload);
    },
  };

  outgoingActions = [
    "SEND_MESSAGE",
    "UPLOAD_FILE",
    "GET_MESSAGES",
    "GET_MESSAGE",
    "EDIT_MESSAGE",
    "DELETE_MESSAGES",
    "MARK_MESSAGES",
    "GET_CONFERENCE_STATUS",
    "SET_CONFERENCE_ACTIVE",
    "SET_CONFERENCE_STOP",
    "GET_CONFERENCE_URL",
    "GET_CHAT_ROOMS",
    "SET_TYPING",
    "GET_USERS",
    "SEND_NOTIFICATION",
  ];

  validateOutgoindData({ action, payload }) {
    if (!this.outgoingActions.includes(action)) {
      this.debugConsole(
        "[WsConsumer] Error: Outgoing action is not found: ",
        action
      );
      return false;
    }
    const rulesForActions = {
      GET_MESSAGES: () => true,
      SEND_MESSAGE: () => {
        if (typeof payload !== "undefined") {
          return true;
        }
      },
      UPLOAD_FILE: () => {
        if (typeof payload !== "undefined") {
          return true;
        }
      },
      EDIT_MESSAGE: () => {
        if (typeof payload !== "undefined") {
          return true;
        }
      },
      DELETE_MESSAGES: () => {
        if (
          typeof payload === "string" ||
          (typeof payload === "object" && typeof payload.length === "number")
        ) {
          // payload: string | array[string]
          return true;
        }
      },
      MARK_MESSAGES: () => {
        if (typeof payload !== "undefined") {
          return true;
        }
      },
      GET_CONFERENCE_STATUS: () => {
        if (typeof payload !== "undefined") {
          return true;
        }
      },
      SET_CONFERENCE_ACTIVE: () => {
        if (typeof payload !== "undefined") {
          return true;
        }
      },
      SET_CONFERENCE_STOP: () => {
        if (typeof payload !== "undefined") {
          return true;
        }
      },
      GET_CONFERENCE_URL: () => {
        return true;
      },
      GET_CHAT_ROOMS: () => {
        return true;
      },
      SET_TYPING: () => {
        return true;
      },
      GET_USERS: () => {
        return true;
      },
      SEND_NOTIFICATION: () => {
        return true;
      },
    };
    return (
      typeof rulesForActions[action] === "function" &&
      rulesForActions[action]() === true
    );
  }
}

export default WebSocketConsumer;
