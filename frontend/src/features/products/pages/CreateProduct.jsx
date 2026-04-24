import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'

/* ── Icons ── */
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
)

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

/* ── Underline Input Field ── */
const InputField = ({ id, label, type = 'text', value, onChange, placeholder, errorMsg, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label
      htmlFor={id}
      className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${errorMsg ? 'text-red-500' : 'text-[#d4a017]'}`}
    >
      {label}
    </label>
    <div
      className={`flex items-center border-b-2 pb-3 ${errorMsg ? 'border-red-500' : 'border-[#2e2a1f] focus-within:border-[#d4a017]'}`}
      style={{ transition: 'border-color 400ms cubic-bezier(0.4,0,0.2,1)' }}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="flex-1 bg-transparent text-[15px] text-white placeholder-[#7a6a3a] outline-none caret-[#d4a017] px-3 py-2"
      />
    </div>
    {errorMsg && <span className="text-[11px] text-red-500 tracking-wide mt-1">{errorMsg}</span>}
  </div>
)

/* ── Textarea Field ── */
const TextareaField = ({ id, label, value, onChange, placeholder, errorMsg }) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={id}
      className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${errorMsg ? 'text-red-500' : 'text-[#d4a017]'}`}
    >
      {label}
    </label>
    <div
      className={`border-b-2 pb-3 ${errorMsg ? 'border-red-500' : 'border-[#2e2a1f] focus-within:border-[#d4a017]'}`}
      style={{ transition: 'border-color 400ms cubic-bezier(0.4,0,0.2,1)' }}
    >
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        autoComplete="off"
        className="w-full bg-transparent text-[15px] text-white placeholder-[#7a6a3a] outline-none caret-[#d4a017] resize-none leading-relaxed px-3 py-2"
      />
    </div>
    {errorMsg && <span className="text-[11px] text-red-500 tracking-wide mt-1">{errorMsg}</span>}
  </div>
)

/* ── Main Page ── */
const CreateProduct = () => {
  const navigate = useNavigate()
  const { handleCreateProduct } = useProduct()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ title: '', description: '', priceAmount: '', priceCurrency: 'USD' })
  const [images, setImages] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState(null)
  const [success, setSuccess] = useState(false)

  const MAX_IMAGES = 7

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const addFiles = useCallback((files) => {
    const fileArr = Array.from(files)
    const remaining = MAX_IMAGES - images.length
    const toAdd = fileArr.slice(0, remaining).filter((f) => f.type.startsWith('image/'))
    setImages((prev) => [...prev, ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) }))])
    if (errors.images) setErrors((prev) => ({ ...prev, images: null }))
  }, [images.length, errors.images])

  const handleFileInput = (e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = '' }

  const removeImage = (index) => {
    setImages((prev) => { URL.revokeObjectURL(prev[index].preview); return prev.filter((_, i) => i !== index) })
  }

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files) }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.description.trim()) errs.description = 'Description is required.'
    if (!form.priceAmount || isNaN(Number(form.priceAmount)) || Number(form.priceAmount) <= 0) errs.priceAmount = 'Enter a valid price.'
    if (!form.priceCurrency.trim()) errs.priceCurrency = 'Currency is required.'
    if (images.length === 0) errs.images = 'Add at least one image.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError(null)
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title.trim())
      formData.append('description', form.description.trim())
      formData.append('priceAmount', form.priceAmount)
      formData.append('priceCurrency', form.priceCurrency.trim().toUpperCase())
      images.forEach(({ file }) => formData.append('images', file))
      await handleCreateProduct(formData)
      setSuccess(true)
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message
      setGlobalError(msg || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#0e0c08]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(212,160,23,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.035) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }}
    >
      {/* ── Top Bar ── */}
      <header className="w-full border-b border-[#2a2414]/60 sticky top-0 z-10 bg-[#0e0c08]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-[0.3em] uppercase text-[#d4a017]"
            style={{ textShadow: '0 0 30px rgba(212,160,23,0.2)' }}
          >
            Snitch
          </span>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#7a6a3a] hover:text-[#d4a017] text-[11px] uppercase tracking-[0.18em] font-semibold"
            style={{ transition: 'color 400ms cubic-bezier(0.4,0,0.2,1)' }}
          >
            <ArrowLeftIcon />
            Back
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-5xl mx-auto px-8 pt-14 pb-28">

        {/* Page heading */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-10 bg-[#d4a017] opacity-50" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#7a6a3a]">New Listing</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Create Product</h1>
          <p className="mt-3 text-sm text-[#7a6a3a] tracking-wide">
            Fill in the details below to publish a new item to the collection.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Two-column layout: left = details+pricing, right = images ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-start">

            {/* ── LEFT: Details + Pricing ── */}
            <div className="flex flex-col gap-12">

              {/* Section: Details */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4a017] font-semibold">01 — Details</span>
                  <div className="h-px flex-1 bg-[#2a2414]" />
                </div>
                <div className="flex flex-col gap-10">
                  <InputField
                    id="title"
                    label="Title"
                    value={form.title}
                    onChange={handleChange('title')}
                    placeholder="e.g. Oversized Linen Jacket"
                    errorMsg={errors.title}
                  />
                  <TextareaField
                    id="description"
                    label="Description"
                    value={form.description}
                    onChange={handleChange('description')}
                    placeholder="Describe the material, fit, and mood of this piece…"
                    errorMsg={errors.description}
                  />
                </div>
              </section>

              {/* Section: Pricing */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4a017] font-semibold">02 — Pricing</span>
                  <div className="h-px flex-1 bg-[#2a2414]" />
                </div>
                <div className="grid grid-cols-2 gap-12">
                  <InputField
                    id="priceAmount"
                    label="Price Amount"
                    type="number"
                    value={form.priceAmount}
                    onChange={handleChange('priceAmount')}
                    placeholder="0.00"
                    errorMsg={errors.priceAmount}
                  />
                  <InputField
                    id="priceCurrency"
                    label="Currency"
                    value={form.priceCurrency}
                    onChange={handleChange('priceCurrency')}
                    placeholder="USD"
                    errorMsg={errors.priceCurrency}
                  />
                </div>
              </section>

            </div>

            {/* ── RIGHT: Images ── */}
            <div className="lg:sticky lg:top-24">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4a017] font-semibold">03 — Visual Documentation</span>
                  <div className="h-px flex-1 bg-[#2a2414]" />
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-4 min-h-[160px] border-2 border-dashed cursor-pointer select-none
                    ${dragOver ? 'border-[#d4a017] bg-[#1a1710]' : errors.images ? 'border-red-500/60' : 'border-[#4f4634] bg-[#141109]/60 hover:border-[#d4a017]/60 hover:bg-[#1a1710]/60'}
                    ${images.length >= MAX_IMAGES ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                  style={{ transition: 'border-color 400ms cubic-bezier(0.4,0,0.2,1), background-color 400ms cubic-bezier(0.4,0,0.2,1)' }}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} disabled={images.length >= MAX_IMAGES} />
                  <div className={`${dragOver ? 'text-[#d4a017]' : 'text-[#7a6a3a]'}`} style={{ transition: 'color 400ms' }}>
                    <UploadIcon />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] text-[#7a6a3a] tracking-wide">
                      {images.length >= MAX_IMAGES ? 'Maximum images reached' : 'Drop images here or click to browse'}
                    </p>
                    <p className="text-[11px] text-[#3d3520] mt-1 uppercase tracking-widest">
                      Up to {MAX_IMAGES} images · JPG, PNG, WEBP
                    </p>
                  </div>
                </div>

                {errors.images && <span className="block text-[11px] text-red-500 tracking-wide mt-3">{errors.images}</span>}

                {/* Thumbnail grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-5">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square">
                        <img src={img.preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover brightness-75" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(idx) }}
                          className="absolute top-1 right-1 w-5 h-5 bg-[#0e0c08]/90 text-[#d4a017] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#d4a017] hover:text-[#0e0c08] transition-all duration-300"
                        >
                          <CloseIcon />
                        </button>
                        <span className="absolute bottom-1 left-1 text-[9px] font-bold text-[#d4a017] bg-[#0e0c08]/70 px-1 tracking-wider">{idx + 1}</span>
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border border-dashed border-[#4f4634] flex items-center justify-center text-[#4f4634] hover:border-[#d4a017] hover:text-[#d4a017] transition-all duration-400"
                      >
                        <PlusIcon />
                      </button>
                    )}
                  </div>
                )}

                <p className="text-[11px] text-[#3d3520] tracking-[0.15em] uppercase mt-4">
                  {images.length} / {MAX_IMAGES} images selected
                </p>
              </section>
            </div>

          </div>

          {/* ── Full-width: global error, success, submit ── */}
          <div className="flex flex-col gap-6 mt-12">

            {/* Global error */}
            {globalError && (
              <div className="bg-red-500/10 border border-red-500/30 px-5 py-4">
                <p className="text-[12px] text-red-400 tracking-wide">⚠ {globalError}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-[#d4a017]/10 border border-[#d4a017]/30 px-5 py-4">
                <p className="text-[12px] text-[#d4a017] tracking-wide">✓ Product published successfully. Redirecting…</p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#d4a017] text-[#0e0c08] text-[11px] uppercase tracking-[0.25em] font-bold py-5 hover:bg-[#f6be39] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 0 40px rgba(212,160,23,0.15)',
                  transition: 'background-color 400ms cubic-bezier(0.4,0,0.2,1), transform 150ms ease',
                }}
              >
                {loading ? 'Publishing…' : success ? 'Published ✓' : 'Publish Product'}
                
              </button>
              <p className="text-center text-[10px] text-[#3d3520] mt-4 tracking-wider uppercase">
                The item will appear in your seller dashboard immediately.
              </p>
            </div>

          </div>

        </form>
      </main>
    </div>
  )
}

export default CreateProduct