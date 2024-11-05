export interface Caption {
    id: string;
    content: string;
    hashtags: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCaptionRequest {
    content: string;
    hashtags: string;
}

export interface CreateCaptionResponse {
    message: string;
    data: Caption;
}

export function createCaptionRequest(content: string, hashtags: string): CreateCaptionRequest {
    return {
        content: content.trim(),
        hashtags: hashtags.trim()
    };
}