import * as signalR from "@microsoft/signalr";

const baseUrl = "http://localhost:5709/api/notifyHub";
let connection = null;

export async function startSignalR(userId, onReceive) {
  if (connection) return;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(baseUrl, {
      accessTokenFactory: () => localStorage.getItem("token") || "",
      withCredentials: true
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", (noti) => {
    if (onReceive) onReceive(noti);
  });

  try {
    await connection.start();
    console.log("✅ SignalR connected");

    if (userId) {
      await connection.invoke("JoinGroup", userId.toString());
    }
  } catch (err) {
    console.error("❌ SignalR error:", err);
  }
}

export async function stopSignalR(userId) {
  if (connection) {
    try {
      if (userId) await connection.invoke("LeaveGroup", userId.toString());
      await connection.stop();
    } catch (err) {
      console.error("❌ Error stopping SignalR:", err);
    }
    connection = null;
  }
}
