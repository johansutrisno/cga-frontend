import React from 'react';
import CaptionItem from '@/components/shared/caption-item';

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

    return (
        <div className="space-y-4">
            {captions.map((item, index) => (
                <CaptionItem
                    key={index}
                    caption={item.caption}
                    hashtags={item.hashtags}
                />
            ))}
        </div>
    );
};

export default CaptionList;