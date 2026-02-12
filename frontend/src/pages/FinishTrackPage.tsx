import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header/Header.tsx'
import { useTrackStore } from '@/store/trackStore.ts'

function FinishTrackPage() {
  const navigate = useNavigate()
  const pastTracks = useTrackStore((s) => s.pastTracks)
  const track = pastTracks[0]

  const handleFinish = () => {
    navigate('/story/recap')
  }

  if (!track) {
    return (
      <div className="page-frame story-page">
        <Header variant="story" />
        <div className="expanded-empty">
          <h2 className="font-hand fs-xl">No past tracks yet</h2>
          <p className="fs-base" style={{ color: 'var(--warm-white)', opacity: 0.7, marginTop: '1rem' }}>
            Finish your current week&apos;s track to see it here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-frame story-page">
      <Header variant="story" />

      <div className="finish-track-view">
        <div className="expanded-header">
          <button
            type="button"
            className="expanded-back font-hand"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </button>
          <h2 className="font-hand fs-xl">Past week&apos;s storyline</h2>
          <p className="expanded-week fs-xs">{track.weekLabel}</p>
        </div>

        <div className="finish-track-grid">
          {track.nodes.map((node, i) => (
            <div
              key={node.id}
              className="collage-card"
            >
              <img
                src={node.src}
                alt={node.alt}
                loading="lazy"
                draggable={false}
              />
              <p className="caption fs-xs">{node.caption}</p>
              <span className="finish-track-pic-label font-hand fs-xs">
                Pic #{String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}

          {Array.from({ length: Math.max(0, 10 - track.nodes.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="collage-card"
            >
            </div>
          ))}
        </div>

        <div className="finish-track-actions">
          <button
            type="button"
            className="btn-gradient btn-cta"
            onClick={handleFinish}
          >
            <span>Finish Track &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinishTrackPage
