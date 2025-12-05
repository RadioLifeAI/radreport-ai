import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, Image as ImageIcon, Info } from 'lucide-react'
import { PIRADSAtlasOption } from '@/lib/piradsAtlasData'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PIRADSImageSelectorProps {
  options: PIRADSAtlasOption[]
  value: number
  onChange: (value: number) => void
  title: string
  subtitle?: string
  columns?: 3 | 4 | 5
  showDetailedDescription?: boolean
}

export function PIRADSImageSelector({
  options,
  value,
  onChange,
  title,
  subtitle,
  columns = 5,
  showDetailedDescription = false
}: PIRADSImageSelectorProps) {
  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      
      <div className={cn('grid gap-2', gridCols[columns])}>
        {options.map((option) => {
          const isSelected = value === option.score
          
          return (
            <TooltipProvider key={option.score} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onChange(option.score)}
                    className={cn(
                      'relative flex flex-col items-center p-3 rounded-lg border-2 transition-all text-left',
                      'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
                      isSelected 
                        ? `${option.color} border-current ring-2 ring-current/30` 
                        : 'bg-card border-border hover:border-muted-foreground/50'
                    )}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={12} className="text-primary-foreground" />
                      </div>
                    )}
                    
                    {/* Image placeholder */}
                    <div className={cn(
                      'w-full aspect-square rounded-md flex flex-col items-center justify-center mb-2',
                      'border border-dashed',
                      isSelected ? 'border-current/50 bg-current/5' : 'border-muted-foreground/30 bg-muted/30'
                    )}>
                      <ImageIcon size={24} className={cn(
                        'mb-1',
                        isSelected ? 'text-current' : 'text-muted-foreground'
                      )} />
                      <span className={cn(
                        'text-lg font-bold',
                        isSelected ? 'text-current' : 'text-muted-foreground'
                      )}>
                        {option.score}
                      </span>
                    </div>
                    
                    {/* Label */}
                    <span className={cn(
                      'text-[11px] font-semibold text-center leading-tight',
                      isSelected ? 'text-current' : 'text-foreground'
                    )}>
                      {option.shortLabel}
                    </span>
                    
                    {/* Short description */}
                    <span className={cn(
                      'text-[9px] text-center leading-tight mt-1 line-clamp-2',
                      isSelected ? 'text-current/80' : 'text-muted-foreground'
                    )}>
                      {option.label}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-semibold text-xs mb-1">Score {option.score}: {option.label}</p>
                  <p className="text-[10px] text-muted-foreground">{option.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
      
      {/* Selected option detailed description */}
      {showDetailedDescription && value > 0 && (
        <div className={cn(
          'p-3 rounded-lg border text-xs',
          options.find(o => o.score === value)?.color || 'bg-muted'
        )}>
          <div className="flex items-start gap-2">
            <Info size={14} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">
                Score {value}: {options.find(o => o.score === value)?.label}
              </p>
              <p className="leading-relaxed">
                {options.find(o => o.score === value)?.detailedDescription}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for inline use in forms
interface PIRADSScoreCardProps {
  option: PIRADSAtlasOption
  isSelected: boolean
  onClick: () => void
  compact?: boolean
}

export function PIRADSScoreCard({ option, isSelected, onClick, compact = false }: PIRADSScoreCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left w-full',
        'hover:shadow-sm',
        isSelected 
          ? `${option.color} border-current` 
          : 'bg-card border-border hover:border-muted-foreground/50'
      )}
    >
      {isSelected && (
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check size={10} className="text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        'w-10 h-10 rounded flex items-center justify-center shrink-0',
        'border border-dashed',
        isSelected ? 'border-current/50 bg-current/10' : 'border-muted-foreground/30 bg-muted/30'
      )}>
        <span className={cn(
          'text-lg font-bold',
          isSelected ? 'text-current' : 'text-muted-foreground'
        )}>
          {option.score}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-xs font-semibold truncate',
          isSelected ? 'text-current' : 'text-foreground'
        )}>
          {option.shortLabel}
        </p>
        {!compact && (
          <p className={cn(
            'text-[10px] line-clamp-1',
            isSelected ? 'text-current/80' : 'text-muted-foreground'
          )}>
            {option.label}
          </p>
        )}
      </div>
    </button>
  )
}

// Atlas reference viewer (read-only, for the Atlas tab)
interface PIRADSAtlasViewerProps {
  options: PIRADSAtlasOption[]
  title: string
  description?: string
}

export function PIRADSAtlasViewer({ options, title, description }: PIRADSAtlasViewerProps) {
  const [expandedScore, setExpandedScore] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold">{title}</h4>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.score}
            className={cn(
              'rounded-lg border-2 overflow-hidden transition-all cursor-pointer',
              option.color,
              expandedScore === option.score ? 'ring-2 ring-current/30' : ''
            )}
            onClick={() => setExpandedScore(expandedScore === option.score ? null : option.score)}
          >
            <div className="flex items-center gap-3 p-3">
              {/* Score badge */}
              <div className={cn(
                'w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0',
                'border border-dashed border-current/50 bg-current/10'
              )}>
                <ImageIcon size={16} className="text-current mb-0.5" />
                <span className="text-sm font-bold text-current">{option.score}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{option.label}</p>
                <p className="text-[10px] text-current/80 mt-0.5">{option.description}</p>
              </div>
              
              {/* Expand indicator */}
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform',
                'bg-current/10',
                expandedScore === option.score ? 'rotate-180' : ''
              )}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            
            {/* Expanded content */}
            {expandedScore === option.score && (
              <div className="px-3 pb-3 pt-0">
                <div className="p-3 rounded bg-background/50 text-xs leading-relaxed">
                  {option.detailedDescription}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
