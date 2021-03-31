import EventEmitter from "eventemitter3";
import axios from "axios";

class WsCommon extends EventEmitter {
  debugConsole(text, ...args) {
    if (this.debug === true) {
      console.log(text, ...args);
    }
  }

  async uploadFile(message) {
    const {
      payload: { file, requestId },
    } = message;
    const fileData = new FormData();
    fileData.append("file", file);
    fileData.append("requestId", requestId);
    await axios({
      method: "post",
      url: `${this.api_url}media/upload`,
      data: fileData,
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
      onUploadProgress: (event) => {
        this.emit("fileUploadProgress", { requestId, event });
      },
      responseType: "json",
    })
      .then((response) => {
        this.emit("fileUploadSuccess", { requestId, data: response.data });
      })
      .catch((error) => {
        this.emit("fileUploadError", error);
      });
  }
}

export default WsCommon;
