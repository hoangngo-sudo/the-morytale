import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header/Header.tsx'
import Marquee from '@/components/Marquee/Marquee.tsx'
import SignInModal from '@/components/SignInModal/SignInModal.tsx'
import { useAuthStore } from '@/store/authStore.ts'
import 'animate.css'

const wavyFooter = (
  <div className="wavy-footer" aria-hidden="true">
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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

function LandingPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [signInOpen, setSignInOpen] = useState(false)

  const closeSignIn = useCallback(() => setSignInOpen(false), [])

  const handleCtaClick = useCallback(() => {
    if (isAuthenticated) {
      navigate('/story')
    } else {
      setSignInOpen(true)
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="page-frame landing-frame">
      <Header variant="landing" />
      <Marquee />

      {/* {scissorsIcon} */}

      <section className="hero-section">
        <h1 className="hero-title fs-xxxl animate__animated animate__fadeInUp">
          What is a <span style={{ color: '#000000' }}>Mory</span>
          <span style={{ color: '#C22626' }}>tale</span>?
        </h1>

        <div
          className="tagline-block animate__animated animate__fadeInUp"
        >
          <p className="tagline-body fs-base">
            "Morytale captures the moments of rythm and tales of your everyday digital life."
          </p>
        </div>
      </section>

      <div className="cta-wrapper animate__animated animate__fadeInUp">
        <button
          type="button"
          className="btn-gradient btn-cta"
          onClick={handleCtaClick}
        >
          <span>Let your story begins here &rarr;</span>
        </button>
      </div>

      {wavyFooter}

      <SignInModal isOpen={signInOpen} onClose={closeSignIn} />
    </div>
  )
}

export default LandingPage
