import * as signalR from "@microsoft/signalr";

let connection = null;

export async function startNotificationHub({
  hubUrl,
  userId,
  onTelegramLinked
}) {
  
  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, { withCredentials: true })
    .withAutomaticReconnect()
    .build();

  connection.on("TelegramLinked", payload => {
    onTelegramLinked?.(payload);
  });

  await connection.start();
  await connection.invoke("JoinGroup", String(userId));

  return connection;
}


export async function stopNotificationHub() {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}
