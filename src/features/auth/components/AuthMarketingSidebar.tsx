import React from "react";
import { Shield } from "lucide-react";

export const AuthMarketingSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-[#0B0F19] text-white flex-col justify-between p-12 relative overflow-hidden select-none border-r border-slate-800/80">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/0 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-indigo-600/20 to-pink-600/0 blur-[120px] pointer-events-none" />

      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top brand header */}
      <div className="flex items-center gap-2.5 text-white font-extrabold text-xl relative z-10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/25">
          <Shield className="h-5.5 w-5.5 text-white" />
        </div>
        <span className="tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          TrustLayer
        </span>
      </div>

      {/* Hero section */}
      <div className="my-auto relative z-10 max-w-lg">
        <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] pb-4">
          You found the deal. We make it safe.
        </h2>
        <p className="text-slate-400 text-[15px] leading-relaxed">
          Met on Marketplace, Instagram, or Discord? Send your transaction through TrustLayer. You make the deal, we protect that deal! Everyone wins.
        </p>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs text-slate-500 relative z-10 pt-4 border-t border-slate-900/40">
        <span>&copy; {new Date().getFullYear()} TrustLayer Inc.</span>
      </div>
    </div>
  );
};
