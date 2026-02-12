import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNotificationStore } from '@/store/notificationStore'

interface DailyUpdateToastProps {
  show: boolean
}

function DailyUpdateToast({ show }: DailyUpdateToastProps) {
  const notifications = useNotificationStore(s => s.notifications)
  const unreadCount = useNotificationStore(s => s.unreadCount)
  const markAsRead = useNotificationStore(s => s.markAsRead)
  const [visible, setVisible] = useState(false)

  // Derive latest unread notification from store state
  const latestNotification = useMemo(
    () => (show && unreadCount > 0 ? notifications.find(n => !n.read) ?? null : null),
    [show, unreadCount, notifications]
  )

  // Show toast when a new unread notification appears
  useEffect(() => {
    if (latestNotification) {
      setVisible(true)
    }
  }, [latestNotification])

  const handleDismiss = useCallback(async () => {
    if (latestNotification) {
      // Mark as read and hide
      await markAsRead(latestNotification._id)
      setVisible(false)
    } else {
      setVisible(false)
    }
  }, [latestNotification, markAsRead])

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, handleDismiss])

  if (!latestNotification) return null

  // Format message based on type
  let title = 'New Notification'
  let body = ''

  if (latestNotification.type === 'like') {
    title = 'New Like'
    body = `${latestNotification.from_user_id?.username || 'Someone'} liked your node: "${latestNotification.node_id?.recap_sentence?.substring(0, 30)}..."`
  } else if (latestNotification.type === 'friend_request') {
    title = 'Friend Request'
    body = `${latestNotification.from_user_id?.username || 'Someone'} sent you a friend request.`
  } else if (latestNotification.type === 'friend_accepted') {
    title = 'Friend Request Accepted'
    body = `${latestNotification.from_user_id?.username || 'Someone'} accepted your friend request.`
  }

  if (!visible) return null

  return (
    <div className="toast-container">
      <div className="toast-panel">
            <button
              type="button"
              className="toast-close"
              onClick={handleDismiss}
              aria-label="Dismiss"
            >
              &times;
            </button>
            <h4 className="toast-title font-hand fs-s">{title}</h4>
            <p className="toast-body fs-xs">
              {body}
            </p>
            <span className="toast-time fs-xs">Just now</span>
      </div>
    </div>
  )
}

export default DailyUpdateToast
