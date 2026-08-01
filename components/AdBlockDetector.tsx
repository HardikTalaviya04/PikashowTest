"use client"

import { useEffect, useState } from "react"

export function AdBlockDetector({
  children,
}: {
  children: React.ReactNode
}) {
  const [adBlocked, setAdBlocked] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
      method: "HEAD",
      mode: "no-cors",
    })
      .then(() => {
        setAdBlocked(false)
        setChecked(true)
      })
      .catch(() => {
        setAdBlocked(true)
        setChecked(true)
      })
  }, [])

  return (
    <>
      {children}
      {checked && adBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white p-6">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Ad Blocker Detected</h2>
            <p className="mb-6 text-slate-300">
              Please disable your ad blocker to continue using this website.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 rounded-lg font-semibold"
            >
              I’ve Disabled It
            </button>
          </div>
        </div>
      )}
    </>
  )
}
