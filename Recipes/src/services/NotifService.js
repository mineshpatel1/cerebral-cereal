import PushNotification from 'react-native-push-notification';
import NotifHandler from './NotifHandler';

const channelId = 'cooking-timers';
const alarmSound = 'alarm.mp3';
const commonNotif = {
  channelId: channelId,
  largeIcon: '@drawable/logo',
  smallIcon: '@drawable/ic_notification',
  soundName: alarmSound,
  vibrate: true,
}

export default class NotifService {
  constructor(onRegister, onNotification) {
    this.lastId = 0;
    this.lastChannelCounter = 0;

    this.createDefaultChannels();

    NotifHandler.attachRegister(onRegister);
    NotifHandler.attachNotification(onNotification);

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }

  createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: channelId,
        channelName: "Cooking Timers",
        channelDescription: "For notifying when recipe timers expire.",
        soundName: alarmSound,
        importance: 4,
        vibrate: true,
      },
    );
  }

  local = (title, message, colour=null) => {
    this.lastId++;
    const notifProps = Object.assign({}, commonNotif, {
      id: this.lastId,
      color: colour,
      title: title,
      message: message,
    })
    PushNotification.localNotification(notifProps);
  }

  schedule = (title, message, scheduleSeconds, colour=null) => {
    this.lastId++;
    const notifProps = Object.assign({}, commonNotif, {
      date: new Date(Date.now() + scheduleSeconds * 1000), // in 5 secs
      id: this.lastId,
      color: colour,
      title: title,
      message: message,
    });
    PushNotification.localNotificationSchedule(notifProps);
    return this.lastId;
  }

  getScheduled = callback => {
    PushNotification.getScheduledLocalNotifications(callback);
  }

  deleteChannel = channelId => {
    PushNotification.deleteChannel(channelId);
  }

  checkPermission = cbk => {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions = () => {
    return PushNotification.requestPermissions();
  }

  cancel = (id=null) => {
    const cancelId = id ? id : this.lastId;
    PushNotification.cancelLocalNotifications({id: cancelId.toString()});
  }

  cancelAll = () => {
    PushNotification.cancelAllLocalNotifications();
  }

  abandonPermissions = () => {
    PushNotification.abandonPermissions();
  }

  getScheduledLocalNotifications = callback => {
    PushNotification.getScheduledLocalNotifications(callback);
  }
}