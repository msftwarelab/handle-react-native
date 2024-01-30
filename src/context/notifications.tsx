import {Toast} from '@/components';
import {AnimatePresence} from 'moti';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

type Notification = {
  title: string;
  body: string | ReactNode;
  ttl?: number;
  type: 'error' | 'success' | 'info' | 'credit-info';
  offset?: number;
};

type NotificationsContextType = {
  sendNotification: (notification: Notification) => void;
};

const NotificationsContext = createContext<NotificationsContextType>(
  {} as NotificationsContextType,
);

export function useNotifications() {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({children}: {children: ReactNode}) {
  // Display stack of notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(false);

  // Send a notification
  const sendNotification = useCallback(
    (notification: Notification) => {
      switch (notification.type) {
        case 'error':
          ReactNativeHapticFeedback.trigger('notificationError');
          break;
        case 'success' || 'credit-info':
          ReactNativeHapticFeedback.trigger('notificationSuccess');
          break;
        case 'info':
          ReactNativeHapticFeedback.trigger('impactMedium');
      }
      setNotifications(notifs => [...notifs, notification]);
    },
    [setNotifications],
  );

  // Show the next notification in the stack
  useEffect(() => {
    if (notifications.length > 0 && !visible) {
      setVisible(true);
    }
  }, [notifications, visible]);

  // Hide the notification after a delay
  useEffect(() => {
    if (notifications.length > 0 && visible) {
      const timeout = setTimeout(() => {
        setVisible(false);
        setNotifications(notifs => notifs.slice(1));
      }, notifications[0].ttl || 3000);
      return () => clearTimeout(timeout);
    }
  }, [notifications, visible]);

  const memoChildren = useMemo(() => children, [children]);

  // Render the notification
  return (
    <NotificationsContext.Provider value={{sendNotification}}>
      <AnimatePresence>
        {visible && (
          <Toast
            title={notifications[0]?.title}
            body={notifications[0]?.body}
            visible={!!notifications[0]}
            type={notifications[0]?.type}
            offset={notifications[0]?.offset}
          />
        )}
      </AnimatePresence>
      {memoChildren}
    </NotificationsContext.Provider>
  );
}
