// let permission = Notification.permission;

// if(permission === "granted") {
//    showNotification();
// } else if(permission === "default"){
//    requestAndShowPermission();
// } else {
//   alert("Use normal alert");
// }

export function showNotification(options) {
//   if (document.visibilityState === "visible") {
//     return;
//   }
  let notification = new Notification(options?.title, { body: options?.body });

  notification.onclick = () => {
    notification.close();
    window.parent.focus();
  };
}

export function requestAndShowPermission(options) {
  Notification.requestPermission(function (permission) {
    if (permission === "granted") {
      showNotification(options);
    }
  });
}
