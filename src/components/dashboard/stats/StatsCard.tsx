"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, TrendingDown, TrendingUp, Info, ArrowDownIcon, ArrowUpIcon, HelpCircleIcon, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomTooltip } from "@/components/ui/custom-tooltip"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
  info?: string
  previousValue?: string
  changePercentage?: number
  metadata?: {
    lastUpdated?: string
    source?: string
    frequency?: string
  }
  helpMessage?: {
    title: string
    content: string
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  info,
  previousValue,
  changePercentage,
  metadata,
  helpMessage,
  className
}: StatsCardProps) {
  return (
    <TooltipProvider>
      <Card className={cn("relative transition-all duration-200 hover:bg-accent/5", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {helpMessage && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircleIcon className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-[200px]">
                    <p className="font-semibold mb-1">{helpMessage.title}</p>
                    <p className="text-sm text-muted-foreground">{helpMessage.content}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
            {info && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[200px] text-sm">{info}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.value}%
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{value}</div>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
} 