import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export interface TrustProfileCardProps {
  user: {
    username: string
    avatarUrl: string
    trustScore: number
    rating: number
    reviewCount: number
    successfulDeals: number
    memberSince: string | number
    isTrustedMember?: boolean
  }
  variant?: 'small' | 'medium' | 'large'
  className?: string
  onClick?: () => void
}

export function TrustProfileCard({ user, variant = 'medium', className, onClick }: TrustProfileCardProps) {
  // Define styles based on variant
  const avatarSizes = {
    small: "w-14 h-14",
    medium: "w-16 h-16",
    large: "w-24 h-24"
  }

  const avatarPixelSizes = {
    small: 56,
    medium: 64,
    large: 96
  }

  const nameSizes = {
    small: "text-[15px]",
    medium: "text-[16px]",
    large: "text-[22px]"
  }

  const scoreSizes = {
    small: "text-[20px]",
    medium: "text-[22px]",
    large: "text-[28px]"
  }
  const statSizes = {
    small: "text-[20px]",
    medium: "text-[28px]",
    large: "text-[32px]"
  }

  return (
    <div
      className={cn(
        "bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 relative overflow-hidden text-left w-full",
        onClick ? "cursor-pointer hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98]" : "",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 sm:gap-4 mb-6">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={avatarPixelSizes[variant]}
            height={avatarPixelSizes[variant]}
            className="rounded-full object-cover shadow-[0_4px_12px_rgba(0,0,0,0.1)] shrink-0"
          />
        ) : (
          <div className={cn("rounded-full bg-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)] shrink-0", avatarSizes[variant])} />
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex flex-wrap justify-between items-start gap-x-2 gap-y-2 w-full">
            <div className="flex flex-col min-w-0 shrink">
              <p className={cn("font-extrabold text-foreground mb-1.5 truncate", nameSizes[variant])}>
                {user.username}
              </p>
              {user.isTrustedMember && (
                <div className="flex items-center">
                  <span className="bg-green-50 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                    <Star className="w-2.5 h-2.5 fill-green-600 text-green-600 shrink-0" /> <span className="truncate">TRUSTED MEMBER</span>
                  </span>
                </div>
              )}
            </div>
            <div className="text-right flex flex-col items-end shrink-0 ml-auto">
              <div className="text-[11px] sm:text-[12px] font-medium text-muted-foreground tracking-[0.05em] sm:tracking-[0.08em] uppercase mb-0.5 sm:mb-1">User Trust Score</div>
              <div className={cn("font-black text-blue-600 leading-none", scoreSizes[variant])}>
                {user.trustScore}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2.5 sm:mt-1.5 flex-wrap">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-[13px] font-bold text-gray-900">{Number(user.rating).toFixed(1)}</span>
            <span className="text-[12px] font-medium text-gray-400 mx-0.5 shrink-0">•</span>
            <span className="text-[12px] font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-gray-700 transition-colors whitespace-nowrap">
              {user.reviewCount} Reviews
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#F7F8FA] p-5 rounded-[20px] flex flex-col items-start justify-center overflow-hidden">
          <div className="text-[11px] sm:text-[12px] text-muted-foreground uppercase font-medium tracking-[0.08em] mb-2 whitespace-nowrap">Successful Deals</div>
          <div className={cn("font-bold text-foreground leading-none", statSizes[variant])}>{user.successfulDeals}</div>
        </div>
        <div className="bg-[#F7F8FA] p-5 rounded-[20px] flex flex-col items-start justify-center overflow-hidden">
          <div className="text-[11px] sm:text-[12px] text-muted-foreground uppercase font-medium tracking-[0.08em] mb-2 whitespace-nowrap">Member Since</div>
          <div className={cn("font-bold text-foreground leading-none", statSizes[variant])}>{user.memberSince}</div>
        </div>
      </div>
    </div>
  )
}
