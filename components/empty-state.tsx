import { FileText, FolderOpen, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          asChild={!!action.href}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  )
}

// Vordefinierte Empty States
export function NoRequestsEmpty({
  onAction,
  className,
}: {
  onAction?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={FileText}
      title="Keine Anfragen"
      description="Erstellen Sie Ihre erste Analyse-Anfrage, um Bewerbungen zu ranken."
      action={
        onAction
          ? { label: 'Neue Anfrage starten', onClick: onAction }
          : undefined
      }
      className={className}
    />
  )
}

export function NoResultsEmpty({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="Keine Ergebnisse"
      description="Die Analyse läuft noch oder hat keine Ergebnisse produziert."
      className={className}
    />
  )
}
