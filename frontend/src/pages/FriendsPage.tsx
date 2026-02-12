import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header/Header.tsx'
import { useSocialStore } from '@/store/socialStore.ts'

const wavyFooter = (
  <div className="wavy-footer wavy-footer-relative" aria-hidden="true">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0,80 C240,20 480,100 720,60 C960,20 1200,100 1440,50"
        stroke="#f5f5f0"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M0,100 C300,40 600,110 900,70 C1100,45 1300,90 1440,75"
        stroke="#7a7a7a"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
    </svg>
  </div>
)

function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'my-friends' | 'find'>('my-friends')
  const [searchEmail, setSearchEmail] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  const friends = useSocialStore((s) => s.friends)
  const fetchFriends = useSocialStore((s) => s.fetchFriends)
  const searchUser = useSocialStore((s) => s.searchUser)
  const searchResults = useSocialStore((s) => s.searchResults)
  const clearSearch = useSocialStore((s) => s.clearSearch)
  const sendFriendRequest = useSocialStore((s) => s.sendFriendRequest)
  const isLoading = useSocialStore((s) => s.isLoading)
  const error = useSocialStore((s) => s.error)

  const friendRequests = useSocialStore((s) => s.friendRequests)
  const fetchFriendRequests = useSocialStore((s) => s.fetchFriendRequests)
  const acceptFriendRequest = useSocialStore((s) => s.acceptFriendRequest)
  const rejectFriendRequest = useSocialStore((s) => s.rejectFriendRequest)

  useEffect(() => {
    fetchFriends()
    fetchFriendRequests()
  }, [fetchFriends, fetchFriendRequests])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchEmail.trim()) return
    await searchUser(searchEmail)
    setRequestSent(false)
  }

  const handleSendRequest = async () => {
    if (searchResults) {
      const success = await sendFriendRequest(searchResults._id || searchResults.id)
      if (success) {
        setRequestSent(true)
        // Refresh lists in case of auto-accept or just to be safe
        fetchFriends()
        fetchFriendRequests()
      }
    }
  }

  // Handle query params for auto-search
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const findEmail = searchParams.get('find')

    if (findEmail) {
      setActiveTab('find')
      setSearchEmail(findEmail)
      searchUser(findEmail)
      // Clean up URL
      window.history.replaceState({}, '', '/friends')
    }
  }, [searchUser])

  // Clear search results when switching tabs
  useEffect(() => {
    if (activeTab === 'my-friends') {
      clearSearch()
      setSearchEmail('')
      setRequestSent(false)
    }
  }, [activeTab, clearSearch])

  return (
    <div className="page-frame story-page">
      <Header variant="story" />

      <div className="friends-view">
        <div className="friends-header">
          <h2 className="font-hand fs-xxl">Friends</h2>
        </div>

        <div className="track-tabs">
          <button
            type="button"
            className={`track-tab font-hand fs-s ${activeTab === 'my-friends' ? 'track-tab-active' : ''}`}
            onClick={() => setActiveTab('my-friends')}
          >
            My Friends
          </button>
          <button
            type="button"
            className={`track-tab font-hand fs-s ${activeTab === 'find' ? 'track-tab-active' : ''}`}
            onClick={() => setActiveTab('find')}
          >
            Find Friends
          </button>
        </div>

        {activeTab === 'my-friends' ? (
          <div className="friends-grid">
            {friends.length === 0 ? (
              <p className="friends-empty-state fs-base font-body">
                You haven't added any friends yet.
              </p>
            ) : (
              friends.map((friend, i) => (
                <div
                  key={friend.id}
                >
                  <Link to={`/profile/${friend._id || friend.id}`} className="friend-card">
                    <img
                      src={friend.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${friend.username}`}
                      alt={friend.username}
                      className="friend-card-avatar"
                      width="80"
                      height="80"
                      loading="lazy"
                      draggable={false}
                    />
                    <span className="friend-card-name font-hand fs-s">{friend.username}</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="friends-find">
            {/* Pending Requests Section */}
            {friendRequests.length > 0 && (
              <div className="friend-requests-section">
                <h3 className="friend-requests-title font-hand fs-m">Pending Requests</h3>
                <div className="friend-requests-grid">
                  {friendRequests.map((req: any) => (
                    <div
                      key={req._id}
                      className="friend-request-card"
                    >
                      <div className="friend-request-info">
                        <img
                          src={req.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${req.username}`}
                          alt={req.username}
                          className="friend-request-avatar"
                        />
                        <div className="friend-request-details">
                          <span className="friend-request-name font-hand fs-s">{req.username}</span>
                          <span className="friend-request-email fs-xs">{req.email}</span>
                        </div>
                      </div>
                      <div className="friend-request-actions">
                        <button
                          onClick={() => acceptFriendRequest(req._id)}
                          className="btn-gradient btn-accept btn-sm"
                        >
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(req._id)}
                          className="btn-gradient btn-decline btn-sm"
                        >
                          <span>Ignore</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="friend-requests-divider" />
              </div>
            )}

            {/* Search Section */}
            <div className="friends-search-section">
              <h3 className="friends-search-title font-hand fs-m">Find by Email</h3>
              <form onSubmit={handleSearch} className="friends-search-form">
                <input
                  type="email"
                  placeholder="Enter friend's email address..."
                  className="friends-search-input font-body"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn-gradient btn-signin btn-sm"
                  disabled={isLoading || !searchEmail}
                >
                  <span>{isLoading ? 'Searching...' : 'Search'}</span>
                </button>
              </form>

              {error && (
                <p className="friends-search-error fs-s font-body">{error}</p>
              )}

              {searchResults && (
                <div
                  className="friends-search-result"
                >
                  <Link to={`/profile/${searchResults._id || searchResults.id}`} className="friends-result-link">
                    <img
                      src={searchResults.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${searchResults.username}`}
                      alt={searchResults.username}
                      className="friends-result-avatar"
                    />
                    <div className="friends-result-info">
                      <span className="friends-result-name font-hand fs-m">{searchResults.username}</span>
                      <span className="friends-result-email fs-xs">{searchResults.email}</span>
                    </div>
                  </Link>

                  {requestSent ? (
                    <button className="btn-gradient btn-decline" disabled>
                      <span>Request Sent</span>
                    </button>
                  ) : (
                    <button
                      className="btn-gradient btn-accept"
                      onClick={handleSendRequest}
                      disabled={isLoading}
                    >
                      <span>Add Friend</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {wavyFooter}
      </div>
    </div >
  )
}

export default FriendsPage
