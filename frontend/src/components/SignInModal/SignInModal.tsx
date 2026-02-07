import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore.ts'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const

const panelVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
} as const

function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const login = useAuthStore((s) => s.login)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
        const endpoint = isSignUp ? '/auth/register' : '/auth/login'
        const { default: api } = await import('@/services/api')
        
        const payload = isSignUp 
            ? { username: formData.username, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password }

        const res = await api.post(endpoint, payload)
        
        if (res.data.token) {
            await login(res.data.token)
            onClose()
        }
    } catch (err: any) {
        setError(err.response?.data?.message || 'Authentication failed')
    } finally {
        setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
        <motion.div
          className="signin-modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="signin-modal-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <button className="signin-modal-close" onClick={onClose}>&times;</button>

            <h2 className="signin-modal-title font-hand">
                {isSignUp ? 'Join the Studio' : 'Welcome Back'}
            </h2>
            
            <form onSubmit={handleSubmit} className="signin-modal-form">
              {isSignUp && (
                  <input
                    placeholder="Username"
                    className="signin-modal-input"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    required
                  />
              )}
              <input
                placeholder="Email"
                type="email"
                className="signin-modal-input"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                placeholder="Password"
                type="password"
                className="signin-modal-input"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />

              {error && <p className="signin-modal-error">{error}</p>}

              <button type="submit" className="btn-gradient btn-signin" disabled={loading}>
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="signin-divider">
                <span>OR</span>
            </div>

            <button
                type="button"
                className="btn-gradient btn-signin google-signin-btn"
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/google`}
            >
                Sign in with Google
            </button>

            <p className="signin-switch-mode">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  )
}

export default SignInModal
