import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createCaptionRequest } from '@/types/caption';

interface Caption {
    number: number;
    caption: string;
    hashtags: string;
}

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
        finishReason: string;
        index: number;
        safetyRatings: Array<{
            category: string;
            probability: string;
        }>;
    }>;
    usageMetadata: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        totalTokenCount: number;
    };
    modelVersion: string;
}

interface CaptionListProps {
    data: GeminiResponse;
}

const CaptionList: React.FC<CaptionListProps> = ({ data }) => {
    const { user } = useUser();
    const { toast } = useToast()
    const router = useRouter()

    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [savingIndex, setSavingIndex] = useState<number | null>(null);
    const [savedIndexes, setSavedIndexes] = useState<number[]>([]);


    const parseGeminiResponse = (response: GeminiResponse): Caption[] => {
        try {
            const textContent = response.candidates[0].content.parts[0].text;
            const jsonStr = textContent.replace(/```json\n|\n```/g, '');
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('Error parsing response:', error);
            return [];
        }
    };

    const captions = parseGeminiResponse(data);

    const copyToClipboard = (caption: string, hashtags: string, index: number): void => {
        const textToCopy = `${caption}\n\n${hashtags}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedIndex(index);
            setTimeout(() => {
                setCopiedIndex(null);
            }, 2000);
        });
    };

    const handleSave = async (caption: string, hashtags: string, index: number) => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to save your captions. Your changes will not be saved until you authenticate.",
                action: (
                    <ToastAction
                        altText="Sign In"
                        onClick={() => router.push('/sign-in')}
                    >
                        Sign In
                    </ToastAction>
                ),
                variant: "destructive",
            })
            return
        }

        setSavingIndex(index);
        try {
            const request = createCaptionRequest(caption, hashtags)
            const response = await fetch('/api/captions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save caption');
            }

            setSavedIndexes(prev => [...prev, index]);
        } catch (error) {
            console.error('Error saving caption:', error);
        } finally {
            setSavingIndex(null);
        }
    };

    const isSaved = (index: number) => savedIndexes.includes(index);

    return (
        <div className="space-y-4">
            {captions.map((item, index) => (
                <Card key={item.number} className="p-4">
                    <div className="space-y-4">
                        {/* Caption */}
                        <div>
                            <h3 className="font-medium text-lg mb-2">Caption {item.number}</h3>
                            <p className="text-gray-700">{item.caption}</p>
                        </div>

                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-2">
                            {item.hashtags.split(' ').map((hashtag, hashtagIndex) => (
                                <span
                                    key={hashtagIndex}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {hashtag}
                                </span>
                            ))}
                        </div>

                        <div className='flex gap-2'>
                            {/* Copy Button */}
                            <Button
                                variant="outline"
                                className="w-full flex items-center gap-2 justify-center"
                                onClick={() => copyToClipboard(item.caption, item.hashtags, index)}
                            >
                                {copiedIndex === index ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </Button>
                            {/* Copy Button */}
                            <Button
                                variant="default"
                                className="w-full flex items-center gap-2 justify-center"
                                onClick={() => handleSave(item.caption, item.hashtags, index)}
                            >
                                {isSaved(index) ? (
                                    <>
                                        <BookmarkCheck className="w-4 h-4" />
                                        Saved!
                                    </>
                                ) : savingIndex === index ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Bookmark className="w-4 h-4" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default CaptionList;