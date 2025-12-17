import { RequestStatus } from '@prisma/client'
import { Check, Circle, Clock, AlertCircle, Loader2, X } from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import t from '@/lib/i18n'

// Status-Konfiguration für visuelle Darstellung
const STATUS_CONFIG: Record<
  RequestStatus,
  {
    label: string
    icon: React.ElementType
    color: string
    bgColor: string
  }
> = {
  DRAFT: {
    label: t.requests.status.DRAFT,
    icon: Circle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
  },
  PENDING_PAYMENT: {
    label: t.requests.status.PENDING_PAYMENT,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  QUEUED: {
    label: t.requests.status.QUEUED,
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  RUNNING: {
    label: t.requests.status.RUNNING,
    icon: Loader2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  DONE: {
    label: t.requests.status.DONE,
    icon: Check,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  FAILED: {
    label: t.requests.status.FAILED,
    icon: X,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
}

// Timeline Item Typ
interface TimelineItem {
  status: RequestStatus
  timestamp?: Date | string
  isCurrent: boolean
  isCompleted: boolean
}

// Status-Timeline Props
interface StatusTimelineProps {
  currentStatus: RequestStatus
  createdAt: Date | string
  updatedAt?: Date | string
  completedAt?: Date | string | null
  className?: string
}

// Status-Reihenfolge für die Timeline
const STATUS_ORDER: RequestStatus[] = [
  'DRAFT',
  'QUEUED',
  'RUNNING',
  'DONE',
]

export function StatusTimeline({
  currentStatus,
  createdAt,
  updatedAt,
  completedAt,
  className,
}: StatusTimelineProps) {
  // Timeline Items generieren
  const getTimelineItems = (): TimelineItem[] => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus)
    
    // Bei FAILED oder PENDING_PAYMENT: Spezielle Behandlung
    if (currentStatus === 'FAILED') {
      return STATUS_ORDER.slice(0, Math.max(currentIndex, 2) + 1).map((status, index) => ({
        status: index === STATUS_ORDER.indexOf('DONE') ? 'FAILED' : status,
        timestamp: index === 0 ? createdAt : undefined,
        isCurrent: status === 'FAILED' || index === currentIndex,
        isCompleted: index < currentIndex,
      }))
    }

    if (currentStatus === 'PENDING_PAYMENT') {
      return [
        { status: 'DRAFT', timestamp: createdAt, isCurrent: false, isCompleted: true },
        { status: 'PENDING_PAYMENT', isCurrent: true, isCompleted: false },
      ]
    }

    return STATUS_ORDER.map((status, index) => ({
      status,
      timestamp:
        status === 'DRAFT'
          ? createdAt
          : status === 'DONE' && completedAt
          ? completedAt
          : undefined,
      isCurrent: index === currentIndex,
      isCompleted: index < currentIndex,
    }))
  }

  const items = getTimelineItems()

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-medium text-muted-foreground">
        {t.requests.detail.timeline}
      </h3>
      <div className="relative">
        {items.map((item, index) => {
          const config = STATUS_CONFIG[item.status]
          const Icon = config.icon
          const isLast = index === items.length - 1

          return (
            <div key={item.status} className="relative pb-8 last:pb-0">
              {/* Verbindungslinie */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-[15px] top-8 h-full w-0.5',
                    item.isCompleted ? 'bg-green-500' : 'bg-muted'
                  )}
                />
              )}

              {/* Item */}
              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    item.isCompleted
                      ? 'bg-green-100'
                      : item.isCurrent
                      ? config.bgColor
                      : 'bg-muted'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      item.isCompleted
                        ? 'text-green-600'
                        : item.isCurrent
                        ? config.color
                        : 'text-muted-foreground',
                      item.isCurrent && item.status === 'RUNNING' && 'animate-spin'
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      item.isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {config.label}
                  </p>
                  {item.timestamp && (
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(item.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Kompakte Status Badge Komponente
interface StatusBadgeProps {
  status: RequestStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
    >
      <Icon
        className={cn(
          'h-3 w-3',
          status === 'RUNNING' && 'animate-spin'
        )}
      />
      <span>{config.label}</span>
    </div>
  )
}
