import { Store } from "react-notifications-component";
import { notificationType } from "../constants/AppConst";

export const showNotificationMsg = (msg:string,type:notificationType = notificationType.INFO)=>{
    Store.addNotification({
        message: msg,
        title: "New Notification",
        type: type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 4000,
          onScreen: true,
          pauseOnHover: true,
          showIcon: true
        }
      });
};