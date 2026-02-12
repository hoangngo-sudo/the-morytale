import { useRef, useEffect } from 'react'
import { useSocialStore } from '@/store/socialStore.ts'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

interface NotificationPopoverProps {
    isOpen: boolean
    onClose: () => void
}

function NotificationPopover({ isOpen, onClose }: NotificationPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null)
    const notifications = useSocialStore((s) => s.notifications)
    const markRead = useSocialStore((s) => s.markRead)
    const markAllRead = useSocialStore((s) => s.markAllRead)
    const acceptFriendRequest = useSocialStore((s) => s.acceptFriendRequest)

    const rejectFriendRequest = useSocialStore((s) => s.rejectFriendRequest)
    const deleteNotification = useSocialStore((s) => s.deleteNotification)

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    const handleAccept = async (userId: string, notifId: string) => {
        const success = await acceptFriendRequest(userId)
        if (success) {
            await deleteNotification(notifId)
        }
    }

    const handleReject = async (userId: string, notifId: string) => {
        const success = await rejectFriendRequest(userId)
        if (success) {
            await deleteNotification(notifId)
        }
    }

    const handleMarkRead = async (e: React.MouseEvent, notifId: string) => {
        e.preventDefault()
        e.stopPropagation()
        await markRead(notifId)
    }

    if (!isOpen) return null

    return (
        <div
            className="notification-popover"
            ref={popoverRef}
        >
                    <div className="notif-header">
                        <h3 className="font-hand">Notifications</h3>
                        {notifications.length > 0 && (
                            <button className="fs-xs" onClick={() => markAllRead()}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <div className="notif-empty fs-s">No notifications</div>
                        ) : (
                            notifications.map((notif: any) => (
                                <div
                                    key={notif._id}
                                    className={`notif-item ${!notif.read ? 'unread' : ''}`}
                                    onClick={() => !notif.read && markRead(notif._id)}
                                >
                                    <img
                                        src={notif.from_user_id?.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${notif.from_user_id?.username}`}
                                        alt="Avatar"
                                        className="notif-avatar"
                                    />
                                    <div className="notif-content">
                                        <p className="notif-text">
                                            <span className="font-bold">{notif.from_user_id?.username}</span>{' '}
                                            {notif.type === 'like' && 'liked your post'}
                                            {notif.type === 'friend_request' && 'sent you a friend request'}
                                            {notif.type === 'friend_accepted' && 'accepted your friend request'}
                                        </p>
                                        <span className="notif-time">{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</span>

                                        {notif.type === 'friend_request' && (
                                            <div className="notif-actions">
                                                <button
                                                    className="btn-gradient btn-accept btn-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.nativeEvent.stopImmediatePropagation();
                                                        handleAccept(notif.from_user_id._id, notif._id);
                                                    }}
                                                >
                                                    <span>Accept</span>
                                                </button>
                                                <button
                                                    className="btn-gradient btn-decline btn-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.nativeEvent.stopImmediatePropagation();
                                                        handleReject(notif.from_user_id._id, notif._id);
                                                    }}
                                                >
                                                    <span>Reject</span>
                                                </button>
                                                <Link
                                                    to={`/friends?find=${notif.from_user_id.email}`}
                                                    className="btn-gradient btn-studio btn-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.nativeEvent.stopImmediatePropagation();
                                                        // Close popover when navigating
                                                        onClose();
                                                    }}
                                                >
                                                    <span>View Profile</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    {!notif.read && (
                                        <button
                                            className="notif-dot"
                                            title="Mark as read"
                                            onClick={(e) => handleMarkRead(e, notif._id)}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
        </div>
    )
}

export default NotificationPopover
