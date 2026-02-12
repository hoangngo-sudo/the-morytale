import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '@/components/Header/Header.tsx'
import { useTrackStore } from '@/store/trackStore.ts'
import type { Track } from '@/types/index.ts'

function ExpandedStoryView() {
  const { trackId } = useParams<{ trackId: string }>()
  const navigate = useNavigate()
  const getTrackById = useTrackStore((s) => s.getTrackById)
  const [track, setTrack] = useState<Track | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (trackId) {
      setIsLoading(true)
      getTrackById(trackId).then((t) => {
        setTrack(t)
        setIsLoading(false)
      })
    }
  }, [trackId, getTrackById])

  if (isLoading) {
    return (
      <div className="page-frame story-page">
        <Header variant="story" />
        <div className="expanded-empty">
          <p className="font-hand fs-l">Loading...</p>
        </div>
      </div>
    )
  }

  if (!track) {
    return (
      <div className="page-frame story-page">
        <Header variant="story" />
        <div className="expanded-empty">
          <h2 className="font-hand fs-xl">Track not found</h2>
          <Link to="/story" className="btn-gradient btn-cta">
            <span>Back to your track</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-frame story-page">
      <Header variant="story" />

      <div className="expanded-view">
        <div className="expanded-header">
          <button
            type="button"
            className="expanded-back font-hand"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </button>
          <h2 className="font-hand fs-xl">{track.title}</h2>
          <p className="expanded-week fs-xs">{track.weekLabel}</p>
        </div>

        <div className="expanded-content">
          {track.nodes.map((node: any, i: number) => (
            <div
              key={node.id}
              className="expanded-entry"
            >
              <div className="expanded-entry-image">
                <img
                  src={node.src}
                  alt={node.alt}
                  loading="lazy"
                  draggable={false}
                />
                <span className="expanded-entry-label font-hand fs-xs">
                  Pic #{String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="expanded-entry-text">
                <h3 className="font-hand fs-m">{node.caption}</h3>
                <p className="fs-base">
                  {track.narrative[i % track.narrative.length]}
                </p>
                <span className="expanded-entry-date fs-xs">{node.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExpandedStoryView
