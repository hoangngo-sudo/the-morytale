import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import SignInModal from '@/components/SignInModal/SignInModal.tsx'
import { useAuthStore } from '@/store/authStore.ts'
import NotificationPopover from './NotificationPopover.tsx'
import { useSocialStore } from '@/store/socialStore.ts'

interface HeaderProps {
  variant?: 'landing' | 'story'
}

function Header({ variant = 'landing' }: HeaderProps) {
  const isStory = variant === 'story'
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const [signInOpen, setSignInOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const unreadCount = useSocialStore((s) => s.unreadCount)
  const fetchNotifications = useSocialStore((s) => s.fetchNotifications)

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, fetchNotifications])

  // Close sidebar on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const openSignIn = useCallback(() => setSignInOpen(true), [])
  const closeSignIn = useCallback(() => setSignInOpen(false), [])
  const toggleNotif = useCallback(() => setNotifOpen(prev => !prev), [])
  const closeNotif = useCallback(() => setNotifOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const handleSignOut = useCallback(() => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }, [logout, navigate])

  const NAV_LINKS = [
    { label: 'Explore', to: '/explore' },
    { label: 'My Track', to: '/story' },
    { label: 'Friends', to: '/friends' },
    { label: 'Profile', to: '/profile' },
  ]

  return (
    <>
      <header className={isStory ? 'story-header' : 'landing-header'}>
        <div className="header-left">
          <Link to="/" className="logo-link" aria-label="Go to home">
            <img
              src="/MORYTALE.svg"
              alt="Morytale"
              className="logo-icon"
              width="56"
              height="56"
              draggable={false}
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="header-nav header-nav-desktop">
          {isAuthenticated ? (
            <ul className="nav-list">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="nav-link font-hand">
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Notification Bell */}
              <li className="nav-item-notif">
                <button
                  className="btn-icon-notif"
                  onClick={toggleNotif}
                  aria-label="Notifications"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </button>
                <NotificationPopover isOpen={notifOpen} onClose={closeNotif} />
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="nav-link font-hand btn-link"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          ) : (
            (!isStory && variant !== 'landing') && (
              <button
                type="button"
                className="btn-gradient btn-signin"
                onClick={openSignIn}
              >
                <span>Sign in / Log in</span>
              </button>
            )
          )}
        </nav>

        {/* Hamburger toggle */}
        {isAuthenticated && (
          <div className="header-nav header-nav-mobile">
            {/* Notification bell stays visible next to hamburger */}
            <div className="nav-item-notif">
              <button
                className="btn-icon-notif"
                onClick={toggleNotif}
                aria-label="Notifications"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </button>
              <NotificationPopover isOpen={notifOpen} onClose={closeNotif} />
            </div>

            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        )}
      </header>

      {/* Mobile sidebar drawer */}
      {menuOpen && isAuthenticated && (
        <div className="sidebar-overlay" onClick={closeMenu} aria-hidden="true">
          <nav
            className="sidebar-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="sidebar-brand font-hand">Morytale</div>

            <ul className="sidebar-nav">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="sidebar-link" onClick={closeMenu}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="sidebar-footer">
              <button
                type="button"
                className="sidebar-signout font-hand"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}

      <SignInModal isOpen={signInOpen} onClose={closeSignIn} />
    </>
  )
}

export default Header
