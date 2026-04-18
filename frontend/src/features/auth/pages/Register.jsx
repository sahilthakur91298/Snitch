import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import {useNavigate} from 'react-router-dom'

/* ── Icons ── */
const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="w-[18px] h-[18px]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const EyeClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="w-[18px] h-[18px]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

/* ── Reusable Input ── */
const InputField = ({ id, label, type = 'text', value, onChange, placeholder, prefix, errorMsg }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${errorMsg ? 'text-red-500' : 'text-[#d4a017]'}`}>
      {label}
    </label>
    <div className={`flex items-center border-b-2 transition-colors duration-300 gap-2 pb-3 ${errorMsg ? 'border-red-500' : 'border-[#2e2a1f] focus-within:border-[#d4a017]'}`}>
      {prefix && (
        <span className={`text-sm shrink-0 font-medium ${errorMsg ? 'text-red-500' : 'text-[#d4a017]'}`}>{prefix}</span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="flex-1 bg-transparent text-[15px] text-white placeholder-[#7a6a3a] outline-none caret-[#d4a017]"
      />
    </div>
    {errorMsg && (
      <span className="text-[11px] text-red-500 tracking-wide mt-1">{errorMsg}</span>
    )}
  </div>
)

/* ── Register Page ── */
const Register = () => {

  const navigate = useNavigate()
  const { handleRegister } = useAuth()

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Derive if the global error is related to the email or contact field
  const isAccountError = error?.toLowerCase().includes('email') || 
                         error?.toLowerCase().includes('exist') || 
                         error?.toLowerCase().includes('contact') || 
                         error?.toLowerCase().includes('contatct')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'isSeller' ? e.target.checked : e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await handleRegister({
        email: form.email,
        password: form.password,
        fullname: form.fullname,
        contact: form.contact,
        isSeller: form.isSeller,
      })
      // Only navigate on success
      navigate('/')
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(backendError || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0c08] flex flex-col lg:flex-row">
      
      {/* ── Left Side (Desktop Branding) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#141109] border-r border-[#2a2414] relative items-center justify-center overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'linear-gradient(#d4a017 1px, transparent 1px), linear-gradient(90deg, #d4a017 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        {/* Large Brand Element */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-[#d4a017] opacity-60" />
            <span className="text-sm uppercase tracking-[0.4em] text-[#7a6a3a]">Est. 2024</span>
            <div className="h-px w-16 bg-[#d4a017] opacity-60" />
          </div>
          <h1 
            className="text-[120px] leading-none font-bold tracking-[-0.04em] uppercase text-[#d4a017]"
            style={{ textShadow: '0 0 80px rgba(212,160,23,0.15)' }}
          >
            Snitch
          </h1>
          <p className="mt-8 text-lg text-[#7a6a3a] tracking-[0.4em] font-medium uppercase text-center max-w-md">
            Join the collective. <br /> Redefine your style.
          </p>
        </div>
      </div>

      {/* ── Right Side (Form Area) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* ── Mobile Brand Header (Hidden on Desktop) ── */}
          <div className="mb-12 text-center lg:hidden">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#d4a017]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#7a6a3a]">Est. 2024</span>
              <div className="h-px w-10 bg-[#d4a017]" />
            </div>

            <h2 className="text-5xl font-bold tracking-[-0.02em] uppercase text-[#d4a017]"
                style={{ textShadow: '0 0 40px rgba(212,160,23,0.25)' }}>
              Snitch
            </h2>
            <p className="mt-3 text-[13px] text-[#5a4e2e] tracking-widest uppercase">
              Create your account
            </p>
          </div>

          {/* ── Desktop Form Intro (Hidden on mobile) ── */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
            <p className="text-sm text-[#7a6a3a]">Enter your details to get started.</p>
          </div>

          {/* ── Form Card ── */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#141109] border border-[#2a2414] px-8 py-10 flex flex-col gap-8"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,160,23,0.06)' }}
        >

          {/* Full Name */}
          <InputField
            id="fullname"
            label="Full Name"
            value={form.fullname}
            onChange={handleChange('fullname')}
            placeholder="Full Name"
          />

          {/* Email */}
          <InputField
            id="email"
            label="Email Address"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
            errorMsg={isAccountError ? error : null}
          />

          {/* Contact Number */}
          <InputField
            id="contact"
            label="Contact Number"
            type="tel"
            value={form.contact}
            onChange={handleChange('contact')}
            placeholder="98765 43210"
            prefix="+91"
            errorMsg={isAccountError ? error : null}
          />

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[10px] uppercase tracking-[0.18em] text-[#d4a017] font-semibold">
              Password
            </label>
            <div className="flex items-center border-b-2 border-[#2e2a1f] focus-within:border-[#d4a017] transition-colors duration-300 pb-3">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="flex-1 bg-transparent text-[15px] text-white placeholder-[#7a6a3a] outline-none caret-[#d4a017]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-[#3d3520] hover:text-[#d4a017] transition-colors duration-200 ml-3 shrink-0"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </div>

          {/* isSeller Toggle */}
          <label
            htmlFor="isSeller"
            className="flex items-center justify-between cursor-pointer group py-1"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#d4a017] font-semibold block mb-1">
                Seller Account
              </span>
              <span className="text-[13px] text-white group-hover:text-[#e8b520] transition-colors duration-200">
                I want to sell on Snitch
              </span>
            </div>

            {/* Custom golden toggle */}
            <div className="relative shrink-0 ml-6">
              <input
                id="isSeller"
                type="checkbox"
                checked={form.isSeller}
                onChange={handleChange('isSeller')}
                className="sr-only"
              />
              {/* Track */}
              <div
                className={`w-12 h-6 border transition-all duration-300 relative ${
                  form.isSeller
                    ? 'bg-[#d4a017] border-[#d4a017]'
                    : 'bg-[#1c1810] border-[#2e2a1f]'
                }`}
              >
                {/* Knob */}
                <div
                  className={`absolute top-[3px] w-[18px] h-[18px] transition-all duration-300 ${
                    form.isSeller
                      ? 'translate-x-[26px] bg-[#0e0c08]'
                      : 'translate-x-[3px] bg-[#3d3520]'
                  }`}
                />
              </div>
            </div>
          </label>

          {/* General Error (for non-email errors) */}
          {error && !isAccountError && (
            <p className="text-[12px] text-red-400 -mt-4 tracking-wide">
              ⚠ {error}
            </p>
          )}

          {/* CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full bg-[#d4a017] text-[#0e0c08] text-[12px] uppercase tracking-[0.2em] font-bold py-4 hover:bg-[#e8b520] active:scale-[0.99] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ boxShadow: '0 0 24px rgba(212,160,23,0.2)' }}
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        {/* ── Footer link ── */}
        <p className="mt-8 text-center text-[12px] text-[#3d3520] tracking-wide">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-[#d4a017] underline underline-offset-4 hover:text-[#e8b520] transition-colors duration-200"
          >
            Sign In
          </a>
        </p>

      </div>
      </div>
    </div>
  )
}

export default Register
