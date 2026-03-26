'use client'

import { useEffect } from 'react'

declare global {
    interface Window {
        adsbygoogle: any[]
    }
}

export default function VerticalAd() {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            }
        } catch (err) {
            console.error('AdSense error:', err)
        }
    }, [])

    return (
        <div className="w-full my-4 flex justify-center">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', minWidth: '160px', minHeight: '600px' }}
                data-ad-client="ca-pub-3990057144186847"
                data-ad-slot="8042500602"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    )
}