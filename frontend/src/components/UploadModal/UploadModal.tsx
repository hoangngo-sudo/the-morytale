import { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadModalProps {
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

/* ── Hoisted static elements (rendering-hoist-jsx) ── */

const uploadIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f5f5f0"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const processFile = useCallback((file: File) => {
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        processFile(file)
      }
    },
    [processFile],
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  const handleSave = useCallback(() => {
    onClose()
    setFileName('')
    setCaption('')
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }, [onClose, preview])

  const handleCancel = useCallback(() => {
    onClose()
    setFileName('')
    setCaption('')
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }, [onClose, preview])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="upload-modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          aria-label="Upload photo"
        >
          <motion.div
            className="upload-modal-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Photo upload section */}
            <div className="upload-modal-section">
              <h3 className="upload-modal-label font-hand">Your photo:</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="upload-modal-file-input"
                onChange={handleFileChange}
              />

              {preview ? (
                <div className="upload-modal-preview">
                  <img src={preview} alt={fileName} draggable={false} />
                  <button
                    type="button"
                    className="upload-modal-change-btn font-hand"
                    onClick={handleUploadClick}
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={`upload-dropzone${dragging ? ' upload-dropzone-active' : ''}`}
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {uploadIcon}
                  <span className="upload-dropzone-text font-hand">
                    Click or drag an image here
                  </span>
                  <span className="upload-dropzone-hint font-body">
                    JPG, PNG, GIF, WebP
                  </span>
                </button>
              )}
              {fileName ? (
                <p className="upload-modal-filename">{fileName}</p>
              ) : null}
            </div>

            {/* Caption input section */}
            <div className="upload-modal-section">
              <h3 className="upload-modal-label font-hand">
                Caption: <span className="upload-modal-hint">(2-3 sentence max)</span>
              </h3>
              <textarea
                className="upload-modal-textarea font-body"
                rows={4}
                placeholder="Write a short caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {/* Footer actions */}
            <div className="upload-modal-footer">
              <button
                type="button"
                className="btn-gradient btn-studio"
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="btn-gradient btn-upload"
                onClick={handleSave}
              >
                <span>Save</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default UploadModal
