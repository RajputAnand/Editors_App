import React, { useEffect, useRef, useState } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "square" | "leaderboard";
  fallback?: React.ReactNode;
  checkTimeout?: number;
  maxWidth?: number; // optional max width for responsive sizing
  onAdLoaded?: (info: {
    slot: string;
    width: number;
    height: number;
    loadedAt: Date;
  }) => void;
}

const AdUnit: React.FC<AdUnitProps> = ({
  slot,
  format = "auto",
  fallback,
  checkTimeout = 5000,
  maxWidth,
  onAdLoaded,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  // const [adInfo, setAdInfo] = useState<{
  //   width: number;
  //   height: number;
  //   loadedAt: Date;
  // } | null>(null);

  useEffect(() => {
    pushedRef.current = false;
  }, [slot]);

  useEffect(() => {
    try {
      if (adRef.current && !pushedRef.current) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({
          // params: { google_adtest: "on" },
        });
        pushedRef.current = true;
        console.log("📢 Adsense script pushed for slot:", slot);
      }
    } catch (e) {
      console.error("Adsense error:", e);
    }

    const poller = setInterval(() => {
      if (adRef.current) {
        const iframe = adRef.current.querySelector("iframe");
        if (iframe && !adLoaded) {
          const info = {
            slot,
            width: iframe.clientWidth,
            height: iframe.clientHeight,
            loadedAt: new Date(),
          };
          setAdLoaded(true);
          // setAdInfo(info);
          onAdLoaded?.(info);
          console.log("✅ Adsense ad loaded:", info);
          clearInterval(poller);
          clearTimeout(timeout);
        }
      }
    }, 500);

    const timeout = setTimeout(() => {
      if (!adLoaded) {
        setTimedOut(true);
        console.warn("⚠️ No ad loaded, showing fallback for slot:", slot);
        clearInterval(poller);
      }
    }, checkTimeout);

    return () => {
      clearInterval(poller);
      clearTimeout(timeout);
    };
  }, [slot, checkTimeout, onAdLoaded]);

  useEffect(() => {
    if (!adRef.current) return;
    const observer = new MutationObserver(() => {
      const iframe = adRef.current?.querySelector("iframe");
      if (iframe) {
        console.log("✅ Ad iframe detected", iframe);
        setAdLoaded(true);
        observer.disconnect();
      }
    });
    observer.observe(adRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-[90%] flex justify-center"
      style={{ maxWidth: maxWidth || "100%" }}
    >
      {!adLoaded && !timedOut && (
        <div className="w-full flex items-center justify-center bg-gray-50 border rounded-lg shadow-sm p-6 animate-pulse">
          <span className="text-gray-400 text-xs">Loading ad…</span>
        </div>
      )}

      {!timedOut && (
        <ins
          className="adsbygoogle"
          style={{
            display: adLoaded ? "block" : "none", // hide until ready
            width: "100%",
            minHeight: 100,
          }}
          data-ad-client="ca-pub-5592520843885493"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
          data-adtest="on"
          ref={adRef}
        />
      )}

      {timedOut && (
        <div className="w-full flex items-center justify-center bg-gray-100 border rounded-lg shadow p-4">
          {fallback || (
            <span className="text-gray-500 text-sm">
              Ad could not be loaded
            </span>
          )}
        </div>
      )}
    </div>

    // <div
    //   className="my-0 w-[90%] flex justify-center"
    //   style={{ maxWidth: maxWidth || "100%" }}
    // >
    //   {!timedOut && (
    //     <ins
    //       className="adsbygoogle"
    //       style={{
    //         display: "block",
    //         width: "100%",
    //         minHeight: 50,
    //       }}
    //       data-ad-client="ca-pub-3940256099942544"
    //       data-ad-slot={slot}
    //       data-ad-format={format}
    //       data-full-width-responsive="true"
    //       data-adtest="on"
    //       ref={adRef}
    //     />
    //   )}

    //   {timedOut && (
    //     <div className="w-full flex items-center justify-center bg-gray-100 border rounded-lg shadow p-4">
    //       {fallback || (
    //         <span className="text-gray-500 text-sm">
    //           Ad could not be loaded
    //         </span>
    //       )}
    //     </div>
    //   )}

    //   {/* Dev debug info */}
    //   {/* {process.env.NODE_ENV === "development" && adInfo && (
    //     <div className="mt-2 text-xs text-gray-500 text-center">
    //       Loaded Ad Slot: {slot} | Size: {adInfo.width}x{adInfo.height} | Time:{" "}
    //       {adInfo.loadedAt.toLocaleTimeString()}
    //     </div>
    //   )} */}
    // </div>
  );
};

export default AdUnit;

// import React, { useEffect, useRef, useState } from "react";

// interface AdUnitProps {
//   slot: string;
//   format?: string;
//   fallback?: React.ReactNode;
//   checkTimeout?: number;
// }

// const AdUnit: React.FC<AdUnitProps> = ({
//   slot,
//   format = "auto",
//   fallback,
//   checkTimeout = 5000,
// }) => {
//   const adRef = useRef<HTMLDivElement>(null);
//   const [adLoaded, setAdLoaded] = useState(false);
//   const [timedOut, setTimedOut] = useState(false);

//   // ✅ detect environment
//   const isDev = process.env.NODE_ENV !== "production";

//   useEffect(() => {
//     if (isDev) {
//       console.log("🧪 Running in DEV → showing test ads only");
//       return; // don't push real ads in dev
//     }

//     try {
//       if (adRef.current && !adRef.current.querySelector("iframe")) {
//         // only push if iframe not already present
//         // @ts-ignore
//         (window.adsbygoogle = window.adsbygoogle || []).push({});
//         console.log("Adsense script pushed");
//       }
//     } catch (e) {
//       console.error("Adsense error:", e);
//     }

//     const poller = setInterval(() => {
//       if (adRef.current) {
//         const iframe = adRef.current.querySelector("iframe");
//         if (iframe) {
//           if (!adLoaded) {
//             setAdLoaded(true);
//             console.log("✅ Adsense ad is available and loaded");
//           }
//           clearInterval(poller);
//         }
//       }
//     }, 500);

//     const timeout = setTimeout(() => {
//       if (!adLoaded) {
//         setTimedOut(true);
//         console.warn("⚠️ No ad loaded, showing fallback");
//         clearInterval(poller);
//       }
//     }, checkTimeout);

//     return () => {
//       clearInterval(poller);
//       clearTimeout(timeout);
//     };
//   }, [adLoaded, checkTimeout, isDev]);

//   return (
//     <div className="my-4 w-full flex justify-center">
//       {!timedOut && (
//         <>
//           {isDev ? (
//             // ✅ DEV MODE → show placeholder test ad
//             <div className="w-full max-w-[320px] h-[100px] flex items-center justify-center bg-yellow-100 border border-dashed rounded-lg">
//               <span className="text-yellow-600 text-sm font-medium">
//                 🧪 Test Ad Placeholder
//               </span>
//             </div>
//           ) : (
//             // 🚀 PROD MODE → real ads
//             <ins
//               className="adsbygoogle"
//               style={{ display: "block", minWidth: 300, minHeight: 100 }}
//               data-ad-client="ca-pub-5592520843885493"
//               data-ad-slot={slot}
//               data-ad-format={format}
//               data-full-width-responsive="true"
//               // data-adtest="on"  <-- keep OFF in production
//               ref={adRef as any}
//             />
//           )}
//         </>
//       )}

//       {timedOut && (
//         <div className="w-full max-w-[320px] h-[100px] flex items-center justify-center bg-gray-100 border rounded-lg shadow">
//           {fallback || (
//             <span className="text-gray-500 text-sm">
//               Advertisement could not be loaded
//             </span>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdUnit;

// ---------------------------------------

// import React, { useEffect, useRef, useState } from "react";

// interface AdUnitProps {
//   slot: string;
//   format?: string;
//   fallback?: React.ReactNode;
//   checkTimeout?: number;
// }

// const AdUnit: React.FC<AdUnitProps> = ({
//   slot,
//   format = "auto",
//   fallback,
//   checkTimeout = 5000,
// }) => {
//   const adRef = useRef<HTMLDivElement>(null);
//   const [adLoaded, setAdLoaded] = useState(false);
//   const [timedOut, setTimedOut] = useState(false);
//   const [adInfo, setAdInfo] = useState<{
//     width: number;
//     height: number;
//     loadedAt: Date;
//   } | null>(null);

//   useEffect(() => {
//     try {
//       if (adRef.current && !adRef.current.querySelector("iframe")) {
//         // @ts-ignore
//         (window.adsbygoogle = window.adsbygoogle || []).push({});
//         console.log("Adsense script pushed");
//       }
//     } catch (e) {
//       console.error("Adsense error:", e);
//     }

//     const poller = setInterval(() => {
//       if (adRef.current) {
//         const iframe = adRef.current.querySelector("iframe");
//         console.log("Checking iframe...", iframe);
//         if (iframe) {
//           if (!adLoaded) {
//             setAdLoaded(true);
//             setAdInfo({
//               width: iframe.clientWidth,
//               height: iframe.clientHeight,
//               loadedAt: new Date(),
//             });
//             console.log("✅ Adsense ad is available and loaded");
//           }
//           clearInterval(poller);
//         }
//       }
//     }, 500);

//     const timeout = setTimeout(() => {
//       if (!adLoaded) {
//         setTimedOut(true);
//         console.warn("⚠️ No ad loaded, showing fallback");
//         clearInterval(poller);
//       }
//     }, checkTimeout);

//     return () => {
//       clearInterval(poller);
//       clearTimeout(timeout);
//     };
//   }, [adLoaded, checkTimeout]);

//   return (
//     <div className="my-0 w-full flex flex-col items-center">
//       {!timedOut && (
//         <ins
//           className="adsbygoogle"
//           style={{ display: "block", minWidth: 200, minHeight: 10 }}
//           data-ad-client="ca-pub-3940256099942544"
//           data-ad-slot={slot}
//           data-ad-format={format}
//           data-full-width-responsive="true"
//           data-adtest="on"
//           ref={adRef as any}
//         />
//       )}

//       {timedOut && (
//         <div className="w-full max-w-[320px] h-[100px] flex items-center justify-center bg-gray-100 border rounded-lg shadow">
//           {fallback || (
//             <span className="text-gray-500 text-sm">
//               Advertisement could not be loaded
//             </span>
//           )}
//         </div>
//       )}

//       {/* Debug info */}
//       {adInfo && (
//         <div className="mt-2 text-xs text-gray-500">
//           Loaded Ad Slot: {slot} | Size: {adInfo.width}x{adInfo.height} | Time:{" "}
//           {adInfo.loadedAt.toLocaleTimeString()}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdUnit;
