import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import {
  MapPinIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { BottomSheet } from '@/components/layout/BottomSheet'
import { Map, MapMarker, MarkerContent, MarkerPopup } from './map'
import { Skeleton } from './Skeleton'

// Helper to format GHS
function formatGHS(amount: number) {
  return `GHS ${amount.toFixed(2)}`
}

// Extract GPS coordinates from various Google Maps URL formats
function parseLocation(locStr: string) {
  if (!locStr) return null
  const safePatterns = [
    /q=([-.\d]+),([-.\d]+)/,           // ?q=lat,lng
    /destination=([-.\d]+),([-.\d]+)/,  // ?destination=lat,lng
    /daddr=([-.\d]+),([-.\d]+)/,        // legacy ?daddr=lat,lng
  ]
  for (const pattern of safePatterns) {
    const match = locStr.match(pattern)
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    }
  }
  return null
}

// Validate that GPS coordinates are real and within Ghana
function validateGps(gps: any) {
  if (!gps || typeof gps.lat !== 'number' || typeof gps.lng !== 'number') return false
  if (isNaN(gps.lat) || isNaN(gps.lng)) return false
  if (gps.lat === 0 && gps.lng === 0) return false
  if (gps.lat < 4.0 || gps.lat > 12.0 || gps.lng < -4.0 || gps.lng > 2.0) return false
  return true
}

// Calculate distance in km between two coords (Haversine formula)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

function buildOptimizedRouteUrl(orders: any[], driverGps: any = null) {
  const gpsOrders = orders.filter(o => o.hasGps)
  if (gpsOrders.length < 1) return { url: null, excluded: 0 }

  const anchorLat = driverGps?.lat || gpsOrders[0].gps.lat
  const anchorLng = driverGps?.lng || gpsOrders[0].gps.lng

  const validOrders = []
  let excludedCount = 0

  for (const order of gpsOrders) {
    const dist = getDistanceFromLatLonInKm(anchorLat, anchorLng, order.gps.lat, order.gps.lng)
    if (dist <= 50) {
      validOrders.push({ ...order, distance: dist })
    } else {
      excludedCount++
    }
  }

  const MAX_ROUTE_KM = 80
  const routeOrders = []
  const unvisited = [...validOrders]
  let currentLat = anchorLat
  let currentLng = anchorLng
  let totalDistance = 0

  while (unvisited.length > 0 && routeOrders.length < 10) {
    let nearestIdx = 0
    let nearestDist = Infinity
    for (let i = 0; i < unvisited.length; i++) {
      const d = getDistanceFromLatLonInKm(currentLat, currentLng, unvisited[i].gps.lat, unvisited[i].gps.lng)
      if (d < nearestDist) {
        nearestDist = d
        nearestIdx = i
      }
    }

    if (totalDistance + nearestDist > MAX_ROUTE_KM) {
      excludedCount += unvisited.length
      break
    }

    const next = unvisited.splice(nearestIdx, 1)[0]
    routeOrders.push(next)
    totalDistance += nearestDist
    currentLat = next.gps.lat
    currentLng = next.gps.lng
  }

  const finalOrders = routeOrders
  if (finalOrders.length < 1) return { url: null, excluded: excludedCount }

  const stops = []
  if (driverGps) {
    stops.push(`${driverGps.lat},${driverGps.lng}`)
  }
  for (const order of finalOrders) {
    stops.push(`${order.gps.lat},${order.gps.lng}`)
  }

  return {
    url: `https://www.google.com/maps/dir/${stops.join('/')}`,
    excluded: excludedCount
  }
}

export default function DeliveryMap() {
  useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [deliveryConfirmId, setDeliveryConfirmId] = useState<string | null>(null)
  const [deliveryNoteText, setDeliveryNoteText] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [driverLocation, setDriverLocation] = useState<any>(null)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    // Ported loading mockup
    const timer = setTimeout(() => {
      setOrders([
        {
          id: '1',
          order_ref: 'ORD-5819',
          customer_name: 'Kofi Mensah',
          customer_phone: '+233241234567',
          total_amount: 45,
          payment_status: 'UNPAID',
          delivery_location: 'q=5.1053,-1.2466 Amamoma junction',
          status: 'OUT_FOR_DELIVERY',
          delivery_type: 'DELIVERY'
        },
        {
          id: '2',
          order_ref: 'ORD-8812',
          customer_name: 'Ama Serwah',
          customer_phone: '+233207654321',
          total_amount: 120,
          payment_status: 'PAID',
          delivery_location: 'q=5.112,-1.25 Kwaprow road',
          status: 'OUT_FOR_DELIVERY',
          delivery_type: 'DELIVERY'
        }
      ])
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleUpdatePayment = async (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: newStatus } : o))
  }

  const handleCompleteDelivery = (orderId: string) => {
    setDeliveryNoteText('')
    setDeliveryConfirmId(orderId)
  }

  const executeDeliveryAction = async (actionType: string) => {
    const orderId = deliveryConfirmId
    if (!orderId) return
    setActionLoading(true)
    setTimeout(() => {
      if (actionType === 'COMPLETE') {
        setOrders(orders.filter(o => o.id !== orderId))
      }
      setDeliveryConfirmId(null)
      setActionLoading(false)
    }, 800)
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gps = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setDriverLocation(gps)
        setLocating(false)
      },
      () => {
        setLocating(false)
        alert('Could not get your location')
      }
    )
  }

  const mappedOrders = useMemo(() => {
    return orders.map(order => {
      const rawGps = parseLocation(order.delivery_location)
      const gps = validateGps(rawGps) ? rawGps : null
      let distance = null
      if (gps && driverLocation) {
        distance = getDistanceFromLatLonInKm(driverLocation.lat, driverLocation.lng, gps.lat, gps.lng)
      }
      return {
        ...order,
        gps,
        hasGps: !!gps,
        distance
      }
    })
  }, [orders, driverLocation])

  if (loading) return <DeliveryMapSkeleton />

  const centerCoord = driverLocation || mappedOrders.find(o => o.hasGps)?.gps || { lat: 5.1053, lng: -1.2466 }

  return (
    <div className="flex flex-col md:flex-row gap-6 pb-6 min-h-[400px]">
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4">
        <div className="px-1">
          <h1 className="text-2xl font-black text-emerald-950">Delivery Run</h1>
          <p className="text-xs text-[var(--color-foreground-muted)] mt-1 mb-4">
            {orders.length} orders out for delivery today.
          </p>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-4 w-4 text-[var(--color-foreground-muted)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID or name..."
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-2.5 pl-9 pr-4 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>

        <div className="px-1">
          <button
            onClick={handleGetLocation}
            disabled={locating}
            className={cn(
              "flex items-center justify-center gap-2 w-full rounded-2xl py-2.5 px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all cursor-pointer",
              driverLocation
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-white border border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:bg-neutral-50"
            )}
          >
            {locating ? (
              <ArrowPathIcon className="h-3.5 w-3.5 animate-spin text-emerald-600" />
            ) : (
              <MapPinIcon className="w-3.5 h-3.5" />
            )}
            {driverLocation ? '✓ Location active' : 'Use My Location'}
          </button>
        </div>

        {(() => {
          const gpsCount = mappedOrders.filter(o => o.hasGps).length
          const routeResult = buildOptimizedRouteUrl(mappedOrders, driverLocation)
          const routeUrl = routeResult?.url
          const excludedCount = routeResult?.excluded || 0
          const validCount = gpsCount - excludedCount

          return (
            <div className="px-1">
              {routeUrl ? (
                <a
                  href={routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors shadow-sm"
                >
                  <MapPinIcon className="w-4 h-4" />
                  Start Optimized Route · {Math.min(validCount, 10)} stops
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-neutral-100 text-neutral-400 py-3 px-4 text-[11px] font-bold uppercase tracking-[0.15em] cursor-not-allowed"
                >
                  <MapPinIcon className="w-4 h-4" />
                  {gpsCount === 0 ? 'No GPS stops available' : `Only ${validCount} valid stop(s)`}
                </button>
              )}
            </div>
          )
        })()}

        {orders.length === 0 ? (
          <div className="flex-1 rounded-[2rem] bg-white border border-[var(--color-border)] p-8 text-center flex flex-col items-center justify-center text-[var(--color-foreground-muted)] text-sm italic">
            <MapPinIcon className="w-12 h-12 mb-4 opacity-50 text-neutral-400" />
            No orders out for delivery.
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {mappedOrders.filter(o =>
              !searchQuery ||
              o.order_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()))
            ).map(order => (
              <div key={order.id} className="rounded-2xl bg-white border border-[var(--color-border)] p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
                      {order.order_ref}
                    </p>
                    <h3 className="font-bold text-emerald-950 text-base mt-0.5">{order.customer_name}</h3>
                    {order.distance != null && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        <MapPinIcon className="w-3 h-3" />
                        {order.distance < 1
                          ? `${Math.round(order.distance * 1000)}m away`
                          : `${order.distance.toFixed(1)}km away`}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-950">{formatGHS(order.total_amount)}</p>
                    <span className={cn(
                      "inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                      order.payment_status === 'PAID' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-100 text-amber-700"
                    )}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[var(--color-foreground-muted)] mb-4">
                  <p className="flex items-start gap-2 break-all">
                    <MapPinIcon className="w-4 h-4 shrink-0 mt-0.5 text-neutral-400" />
                    <span>{order.delivery_location}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => handleUpdatePayment(order.id, order.payment_status === 'PAID' ? 'UNPAID' : 'PAID')}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors border border-[var(--color-border)] hover:bg-neutral-50 cursor-pointer"
                  >
                    <CurrencyDollarIcon className="w-3.5 h-3.5 text-neutral-500" />
                    {order.payment_status === 'PAID' ? 'Mark Unpaid' : 'Collect Cash'}
                  </button>
                  <button
                    onClick={() => handleCompleteDelivery(order.id)}
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <CheckBadgeIcon className="w-3.5 h-3.5" />
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[400px] h-[500px] rounded-[2rem] overflow-hidden border border-[var(--color-border)] shadow-sm relative z-0">
        <Map
          viewport={{
            center: [centerCoord.lng, centerCoord.lat],
            zoom: 12
          }}
          theme="light"
        >
          {driverLocation && (
            <MapMarker
              longitude={driverLocation.lng}
              latitude={driverLocation.lat}
            >
              <MarkerContent>
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white shadow-lg text-white animate-pulse">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rotate-45" />
                </div>
              </MarkerContent>
            </MapMarker>
          )}

          {mappedOrders.filter(o => o.hasGps).map(order => (
            <MapMarker
              key={order.id}
              longitude={order.gps.lng}
              latitude={order.gps.lat}
            >
              <MarkerContent>
                <div className="relative">
                  <div className="h-6 w-6 rounded-full bg-emerald-700 flex items-center justify-center border-2 border-white shadow-lg text-white">
                    <MapPinIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-700 rotate-45" />
                </div>
              </MarkerContent>
              <MarkerPopup closeButton offset={20}>
                <div className="p-2 min-w-[150px]">
                  <p className="font-bold text-sm mb-1 text-emerald-950">{order.customer_name}</p>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${order.gps.lat},${order.gps.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center bg-emerald-600 text-white rounded-lg py-1.5 text-[10px] font-bold uppercase tracking-wider"
                    >
                      Route
                    </a>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
      </div>

      <BottomSheet
        open={!!deliveryConfirmId}
        onClose={() => setDeliveryConfirmId(null)}
        title="Delivery Actions"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
            Log a note if there are issues (e.g., customer not home, left with neighbor).
          </p>

          <textarea
            value={deliveryNoteText}
            onChange={e => setDeliveryNoteText(e.target.value)}
            placeholder="Optional delivery notes..."
            className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl p-4 text-sm outline-none resize-none h-24 focus:border-emerald-500"
          />

          <div className="flex gap-3">
            <button
              onClick={() => executeDeliveryAction('FAILED')}
              disabled={actionLoading}
              className="flex-1 rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              Not Completed
            </button>
            <button
              onClick={() => executeDeliveryAction('COMPLETE')}
              disabled={actionLoading}
              className="flex-1 rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            >
              Complete
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

function DeliveryMapSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 pb-6">
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4">
        <div className="px-1">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-full rounded-2xl mb-4" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
        
        <div className="space-y-3 px-1 mt-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-[var(--color-border)] p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-20 mb-1 ml-auto" />
                  <Skeleton className="h-4 w-12 ml-auto" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow min-h-[400px] h-[500px] rounded-[2rem] overflow-hidden border border-[var(--color-border)] bg-neutral-100 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  )
}
