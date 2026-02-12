import { useRef, useCallback, useState, type DragEvent } from 'react'

import { useTrackStore } from '@/store/trackStore.ts'
interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const createItem = useTrackStore((s) => s.createItem)
  const isLoading = useTrackStore((s) => s.isLoading)

  const handleFile = useCallback((file: File) => {
    // Validate file type - accept any image format
    if (!file.type.startsWith('image/')) {
      alert('Only image files are supported.')
      return
    }
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 10MB.')
      return
    }
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
      // Update the file input for form submission
      const dt = new DataTransfer()
      dt.items.add(file)
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files
      }
    }
  }, [handleFile])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !isLoading) onClose()
    },
    [onClose, isLoading],
  )

  const handleSave = useCallback(async () => {
    if (!fileInputRef.current?.files?.[0]) return

    const file = fileInputRef.current.files[0]
    const formData = new FormData()

    // Structure expected by backend:
    // flattened: file in 'image', data JSON string in 'data'
    // or grouped fields. The current backend (itemController.js:205) supports 'data' field JSON or direct body fields.
    // Let's use direct fields for file + JSON data string for metadata as that's robust

    // Actually looking at backend: 
    // const files = req.files || [];
    // if (req.body.data) ... JSON.parse(req.body.data)

    formData.append('image', file)
    formData.append('data', JSON.stringify({
      content_type: 'image',
      caption: caption,
      description: '', // Optional
    }))

    const success = await createItem(formData)

    if (success) {
      onClose()
      setFileName('')
      setCaption('')
      if (preview) URL.revokeObjectURL(preview)
      setPreview(null)
    } else {
      alert('Failed to upload. Please try again.')
    }
  }, [onClose, preview, caption, createItem])

  const handleCancel = useCallback(() => {
    onClose()
    setFileName('')
    setCaption('')
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }, [onClose, preview])

  if (!isOpen) return null

  return (
    <div
      className="upload-modal-overlay"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-label="Upload photo"
    >
      <div className="upload-modal-panel">
            {/* Modal header */}
            <div className="upload-modal-header">
              <h2 className="upload-modal-title font-hand">Add New Node</h2>
            </div>

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
              
              {/* Drag and drop zone */}
              <div
                className={`upload-dropzone ${isDragging ? 'upload-dropzone-active' : ''} ${preview ? 'upload-dropzone-has-file' : ''}`}
                onClick={handleUploadClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
              >
                {preview ? (
                  <div className="upload-dropzone-preview">
                    <img src={preview} alt={fileName} draggable={false} />
                    <p className="upload-dropzone-filename font-body">{fileName}</p>
                    <span className="upload-dropzone-change font-hand">Click or drop to replace</span>
                  </div>
                ) : (
                  <div className="upload-dropzone-empty">
                    <div className="upload-dropzone-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="upload-dropzone-text font-hand">
                      Drag & drop your image here
                    </p>
                    <span className="upload-dropzone-or font-body">or</span>
                    <span className="upload-dropzone-browse font-hand">Browse files</span>
                  </div>
                )}
              </div>
            </div>

            {/* Caption input section */}
            <div className="upload-modal-section">
              <h3 className="upload-modal-label font-hand">
                Caption: <span className="upload-modal-hint">(2-3 sentence max)</span>
              </h3>
              <textarea
                className="upload-modal-textarea font-body"
                rows={2}
                placeholder="Write a short caption…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {/* Footer actions */}
            <div className="upload-modal-footer">
              <button
                type="button"
                className="btn-gradient btn-decline"
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="btn-gradient btn-accept"
                onClick={handleSave}
                disabled={isLoading || !preview}
              >
                <span>{isLoading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
      </div>
    </div>
  )
}

export default UploadModal