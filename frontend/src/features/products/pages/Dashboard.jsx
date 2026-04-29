import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'

/* ── Icons ── */
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
)

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
)

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
)

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
)

const EmptyBoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.75} stroke="currentColor" className="w-20 h-20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
)

/* ── Product Card (Grid View) ── */
const ProductCard = ({ product, index }) => {
  const [imgError, setImgError] = useState(false)
  const hasImages = product.images && product.images.length > 0 && !imgError

  const price = product.price
    ? `${product.price.currency || 'USD'} ${Number(product.price.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '—'

  return (
    <div
      className="group relative flex flex-col bg-[#0f0d09] border border-[#2a2414]/60 overflow-hidden hover:border-[#d4a017]/40"
      style={{
        transition: 'border-color 400ms cubic-bezier(0.4,0,0.2,1), transform 300ms cubic-bezier(0.4,0,0.2,1)',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#141109]">
        {hasImages ? (
          <img
            src={product.images[0]}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105"
            style={{ transition: 'transform 600ms cubic-bezier(0.4,0,0.2,1), filter 400ms ease' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#3d3520]">
            <ImageIcon />
            <span className="text-[10px] uppercase tracking-widest">No Image</span>
          </div>
        )}

        {/* Image count badge */}
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 text-[9px] font-bold text-[#d4a017] bg-[#0e0c08]/80 px-2 py-0.5 tracking-wider uppercase">
            +{product.images.length - 1} more
          </span>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0e0c08]/60 to-transparent opacity-0 group-hover:opacity-100"
          style={{ transition: 'opacity 400ms ease' }}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-white tracking-wide leading-snug line-clamp-2 flex-1">
            {product.title}
          </h3>
        </div>

        <p className="text-[12px] text-[#7a6a3a] leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2414]">
          <div className="flex items-center gap-1.5 text-[#d4a017]">
            <TagIcon />
            <span className="text-[13px] font-bold tracking-wide">{price}</span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#3d3520] font-semibold">Active</span>
        </div>
      </div>
    </div>
  )
}

/* ── Product Row (List View) ── */
const ProductRow = ({ product, index }) => {
  const [imgError, setImgError] = useState(false)
  const hasImages = product.images && product.images.length > 0 && !imgError

  const price = product.price
    ? `${product.price.currency || 'USD'} ${Number(product.price.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '—'

  return (
    <div
      className="group flex items-center gap-5 px-6 py-4 border-b border-[#2a2414]/60 hover:bg-[#141109] hover:border-[#d4a017]/20"
      style={{ transition: 'background-color 300ms ease, border-color 300ms ease' }}
    >
      {/* Thumb */}
      <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-[#141109] border border-[#2a2414]">
        {hasImages ? (
          <img
            src={product.images[0]}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#3d3520]">
            <ImageIcon />
          </div>
        )}
      </div>

      {/* Title + desc */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-white tracking-wide truncate">{product.title}</p>
        <p className="text-[11px] text-[#7a6a3a] truncate mt-0.5">{product.description}</p>
      </div>

      {/* Images count */}
      <div className="hidden sm:flex flex-col items-center w-16">
        <span className="text-[13px] font-bold text-white">{product.images?.length ?? 0}</span>
        <span className="text-[9px] uppercase tracking-widest text-[#3d3520]">Images</span>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end w-28">
        <span className="text-[13px] font-bold text-[#d4a017] tracking-wide">{price}</span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#3d3520] mt-0.5">Active</span>
      </div>
    </div>
  )
}

/* ── Dashboard ── */
const Dashboard = () => {
  const navigate = useNavigate()
  const { handleGetAllProducts } = useProduct()
  const allProducts = useSelector(state => state.product.sellerProducts)
  const [view, setView] = useState('grid') // 'grid' | 'list'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      await handleGetAllProducts()
      setLoading(false)
    })()
  }, [])

  const totalRevenue = allProducts.reduce((acc, p) => {
    return acc + Number(p?.price?.amount || 0)
  }, 0)

  const stats = [
    { label: 'Total Listings', value: allProducts.length },
    {
      label: 'Total Value',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      label: 'Avg. Price',
      value: allProducts.length
        ? `$${(totalRevenue / allProducts.length).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : '—',
    },
  ]

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
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-[0.3em] uppercase text-[#d4a017]"
            style={{ textShadow: '0 0 30px rgba(212,160,23,0.2)' }}
          >
            Snitch
          </span>

          <nav className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4a017] font-semibold border-b border-[#d4a017] pb-0.5">
              Dashboard
            </span>
            <button
              type="button"
              onClick={() => navigate('/seller/create-product')}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0e0c08] bg-[#d4a017] px-4 py-2 hover:bg-[#f6be39] active:scale-95"
              style={{ transition: 'background-color 300ms ease, transform 150ms ease' }}
            >
              <PlusIcon />
              New Listing
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pt-12 pb-28">

        {/* ── Page Heading ── */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-10 bg-[#d4a017] opacity-50" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#7a6a3a]">Seller Portal</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">My Products</h1>
          <p className="mt-3 text-sm text-[#7a6a3a] tracking-wide">
            Manage your active listings and track your collection performance.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-px bg-[#2a2414]/40 border border-[#2a2414]/40 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#0e0c08] px-8 py-7">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#7a6a3a] font-semibold mb-2">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[#d4a017] opacity-50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7a6a3a] font-semibold">
              {loading ? 'Loading…' : `${allProducts.length} ${allProducts.length === 1 ? 'item' : 'items'}`}
            </span>
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-[#2a2414]">
            <button
              type="button"
              id="view-grid"
              onClick={() => setView('grid')}
              className={`p-2.5 flex items-center justify-center ${view === 'grid' ? 'bg-[#d4a017] text-[#0e0c08]' : 'text-[#7a6a3a] hover:text-[#d4a017]'}`}
              style={{ transition: 'background-color 250ms ease, color 250ms ease' }}
              aria-label="Grid view"
            >
              <GridIcon />
            </button>
            <button
              type="button"
              id="view-list"
              onClick={() => setView('list')}
              className={`p-2.5 flex items-center justify-center ${view === 'list' ? 'bg-[#d4a017] text-[#0e0c08]' : 'text-[#7a6a3a] hover:text-[#d4a017]'}`}
              style={{ transition: 'background-color 250ms ease, color 250ms ease' }}
              aria-label="List view"
            >
              <ListIcon />
            </button>
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className={`${view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'flex flex-col border border-[#2a2414]/40'}`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`bg-[#141109] border border-[#2a2414]/40 animate-pulse ${view === 'grid' ? 'aspect-[4/5]' : 'h-20'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && allProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 border border-dashed border-[#2a2414]">
            <div className="text-[#3d3520]">
              <EmptyBoxIcon />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-white mb-2">No listings yet</p>
              <p className="text-[13px] text-[#7a6a3a]">Create your first product to get started.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/seller/create-product')}
              className="flex items-center gap-2 mt-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#0e0c08] bg-[#d4a017] px-6 py-3 hover:bg-[#f6be39]"
              style={{ transition: 'background-color 300ms ease' }}
            >
              <PlusIcon />
              Create Product
            </button>
          </div>
        )}

        {/* ── Grid View ── */}
        {!loading && allProducts.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* ── List View ── */}
        {!loading && allProducts.length > 0 && view === 'list' && (
          <div className="border border-[#2a2414]/60">
            {/* Header row */}
            <div className="flex items-center gap-5 px-6 py-3 bg-[#141109] border-b border-[#2a2414]">
              <div className="w-14 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#7a6a3a] font-semibold">Product</span>
              </div>
              <div className="hidden sm:block w-16 text-center">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#7a6a3a] font-semibold">Images</span>
              </div>
              <div className="w-28 text-right">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#7a6a3a] font-semibold">Price</span>
              </div>
            </div>
            {allProducts.map((product, index) => (
              <ProductRow key={product._id} product={product} index={index} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard