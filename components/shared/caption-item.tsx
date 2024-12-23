import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { createCaptionRequest } from '@/types/caption';
import { Copy, Check, Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CaptionItemProps {
    id?: string;
    caption: string;
    hashtags: string;
    saved?: boolean;
}

const CaptionItem: React.FC<CaptionItemProps> = ({ id, caption, hashtags, saved = false }) => {
    const { user } = useUser();
    const { toast } = useToast()
    const router = useRouter()

    const [isCopied, setCopied] = useState<boolean | null>(null);
    const [isSaving, setSaving] = useState<boolean | null>(null);
    const [isSaved, setSaved] = useState<boolean | null>(saved);
    const [isRemoving, setRemoving] = useState<boolean | null>(null);
    const [captionId, setCaptionId] = useState<string | null>(id ?? '');

    const copyToClipboard = (caption: string, hashtags: string): void => {
        const textToCopy = `${caption}\n\n${hashtags}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };

    const handleSave = async (caption: string, hashtags: string) => {
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

        setSaving(true);
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

            const responseData = await response.json();
            setCaptionId(responseData.data.id);
            setSaved(true);

            toast({
                title: "Save Caption",
                description: "Caption has been saved to your account",
            })

        } catch (error) {
            console.error('Error saving caption:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async (id: string) => {
        setRemoving(true)
        try {
            const response = await fetch(`/api/captions/${captionId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error)
            }

            setSaved(false)

            toast({
                title: "Remove Caption",
                description: "Caption has been removed from your account",
            })
        }
        catch (error) {
            console.error('Error removing caption:', error);
        }
        finally {
            setRemoving(false);
        }
    }

    return (
        <Card className="p-4">
            <div className="space-y-4">
                {/* Caption */}
                <p className="text-gray-700">{caption}</p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2">
                    {hashtags.split(' ').map((hashtag, hashtagIndex) => (
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
                        onClick={() => copyToClipboard(caption, hashtags)}
                    >
                        {isCopied === true ? (
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
                    {isSaved === true ? (
                        <>
                            {/* Remove Button */}
                            <Button
                                variant="destructive"
                                className="w-full flex items-center gap-2 justify-center"
                                onClick={() => handleRemove(id ?? '')}
                            >
                                {isRemoving === true ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </>
                                )}

                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Copy Button */}
                            <Button
                                variant="default"
                                className="w-full flex items-center gap-2 justify-center"
                                onClick={() => handleSave(caption, hashtags)}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <Bookmark className="w-4 h-4" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}

export default CaptionItem;