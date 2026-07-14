"use client";

import * as React from "react";
import ReactInfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface InfiniteScrollProps {
  /** The children nodes (e.g. list items) to be scrolled */
  children: React.ReactNode;
  /** Current length of data loaded so far */
  dataLength: number;
  /** Callback to fetch the next chunk of data */
  next: () => void;
  /** Whether there is more data to fetch */
  hasMore: boolean;
  /** Custom loader element or preset style */
  loader?: React.ReactNode;
  /** Custom end message when no more items are available */
  endMessage?: React.ReactNode;
  /** Height or max-height of the scroll container, if wrapping in scrollable div */
  height?: number | string;
  /** Class name for the container element */
  className?: string;
  /** Threshold percentage or pixel height at which to trigger next load (0 to 1, or string like "200px") */
  scrollThreshold?: number | string;
  /** CSS selector or DOM element of the scrollable parent container */
  scrollableTarget?: HTMLElement | string | null;
  /** Enable pull-down to refresh functionality */
  pullDownToRefresh?: boolean;
  /** Callback for pull-to-refresh */
  refreshFunction?: () => void;
  /** Optional custom release to refresh message */
  releaseToRefreshContent?: React.ReactNode;
  /** Optional custom pull down to refresh message */
  pullDownToRefreshContent?: React.ReactNode;
}

/**
 * A highly reusable, fully generic InfiniteScroll component.
 * Wraps `react-infinite-scroll-component` with premium style presets.
 */
export function InfiniteScroll({
  children,
  dataLength,
  next,
  hasMore,
  loader,
  endMessage,
  height,
  className,
  scrollThreshold = 0.8,
  scrollableTarget,
  pullDownToRefresh = false,
  refreshFunction,
  releaseToRefreshContent,
  pullDownToRefreshContent,
}: InfiniteScrollProps) {
  // Premium default loader using custom UI spinner
  const defaultLoader = (
    <div className="flex items-center justify-center p-6 w-full animate-fade-in">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border/10 bg-background/50 backdrop-blur-xs shadow-xs text-xs font-medium text-muted-foreground/80">
        <Spinner className="h-4 w-4 text-primary" />
        <span>Loading more items...</span>
      </div>
    </div>
  );

  // Premium default end message
  const defaultEndMessage = (
    <div className="flex items-center justify-center py-10 px-4 w-full animate-fade-in">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/30" />
        <span className="text-xs font-semibold tracking-wider text-muted-foreground/50 select-none uppercase bg-background px-3">
          All caught up
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/30" />
      </div>
    </div>
  );

  // Standard pull to refresh indicators
  const defaultPullDownContent = (
    <div className="flex items-center justify-center py-4 text-xs font-medium text-muted-foreground">
      <span>↓ Pull down to refresh</span>
    </div>
  );

  const defaultReleaseContent = (
    <div className="flex items-center justify-center py-4 text-xs font-medium text-muted-foreground">
      <span>↑ Release to refresh</span>
    </div>
  );

  return (
    <ReactInfiniteScroll
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      loader={loader !== undefined ? loader : defaultLoader}
      endMessage={endMessage !== undefined ? endMessage : defaultEndMessage}
      height={height}
      className={cn("w-full", className)}
      scrollThreshold={scrollThreshold}
      scrollableTarget={scrollableTarget}
      pullDownToRefresh={pullDownToRefresh}
      refreshFunction={refreshFunction}
      releaseToRefreshContent={releaseToRefreshContent || defaultReleaseContent}
      pullDownToRefreshContent={pullDownToRefreshContent || defaultPullDownContent}
    >
      {children}
    </ReactInfiniteScroll>
  );
}
