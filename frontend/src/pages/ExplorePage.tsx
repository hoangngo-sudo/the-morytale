import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header/Header.tsx'
import { useTrackStore } from '@/store/trackStore.ts'

function ExplorePage() {
  const communityTracks = useTrackStore((s) => s.communityTracks)
  const fetchCommunityTracks = useTrackStore((s) => s.fetchCommunityTracks)

  useEffect(() => {
    fetchCommunityTracks()
  }, [fetchCommunityTracks])

  return (
    <div className="page-frame story-page">
      <Header variant="story" />

      <div className="explore-view">
        <div className="explore-header">
          <h2 className="font-hand fs-xxl">Morytale</h2>
          <p className="explore-subtitle fs-s">
            Discover stories from the community
          </p>
        </div>

        <div className="explore-grid">
          {communityTracks.map((track) => (
            <div
              key={track.id}
              className="explore-card"
            >
              <Link to={`/tracks/${track.id}`} className="explore-card-image-link">
                <img
                  src={track.nodes[0]?.src}
                  alt={track.title}
                  loading="lazy"
                  draggable={false}
                  className="explore-card-image"
                />
              </Link>

              <div className="explore-card-body">
                <Link to={`/tracks/${track.id}`} className="explore-card-title font-hand fs-m">
                  {track.title}
                </Link>

                <div className="explore-card-meta">
                  <Link to={`/profile/${track.ownerId}`} className="explore-card-author">
                    <img
                      src={track.ownerAvatar}
                      alt={track.ownerName}
                      className="explore-card-avatar"
                      width="28"
                      height="28"
                      draggable={false}
                    />
                    <span className="fs-xs">{track.ownerName}</span>
                  </Link>
                  <span className="explore-card-week fs-xs">{track.weekLabel}</span>
                </div>

                <div className="explore-card-stats fs-xs">
                  <span>&uarr; {track.upvotes}</span>
                  <span>&middot;</span>
                  <span>{track.commentsCount} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
