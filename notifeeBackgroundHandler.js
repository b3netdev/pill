// notifeeBackgroundHandler.js

import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('[notifee] Background event received:', type);

  const { notification, pressAction } = detail;

  if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
    console.log('User pressed notification in background.');
    // handle it (e.g. navigate, track, etc.)
  }
});
