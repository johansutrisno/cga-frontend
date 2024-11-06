'use client';

import { useEffect, useState } from 'react'
import CaptionItem from '@/components/shared/caption-item'
import type { Caption } from '@/types/caption'

const MyCaptionsPage = () => {
    const [captions, setCaptions] = useState<Caption[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCaptions = async () => {
            try {
                const response = await fetch('/api/captions')
                if (!response.ok) {
                    throw new Error('Failed to fetch captions')
                }
                const { data } = await response.json()
                setCaptions(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCaptions()
    }, [])

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                    <div
                        key={n}
                        className="h-48 rounded-lg bg-gray-200 animate-pulse"
                    />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!captions.length) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-gray-500">No captions found</p>
            </div>
        )
    }

    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {captions.map((item, index) => (
            <CaptionItem
                key={index}
                caption={item.content}
                hashtags={item.hashtags}
                saved={true}
            />
        ))}
    </div>)
}

export default MyCaptionsPage