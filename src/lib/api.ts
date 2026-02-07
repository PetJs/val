// API Client for Valentine Invite Backend

import type {
    CreateInviteRequest,
    CreateInviteResponse,
    InviteResponse,
    MusicSearchResponse,
    UploadVoiceNoteResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error ${response.status}`);
    }
    return response.json();
}

// Create a new invite
export async function createInvite(data: CreateInviteRequest): Promise<CreateInviteResponse> {
    const response = await fetch(`${API_URL}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<CreateInviteResponse>(response);
}

// Get invite by token - backend returns { success, data: {...invite} }
export async function getInvite(token: string): Promise<InviteResponse> {
    const response = await fetch(`${API_URL}/invite/${token}`);
    const result = await handleResponse<{ success: boolean; data: InviteResponse }>(response);
    console.log('getInvite raw response:', result);
    return result.data;
}

// Accept an invite - returns personalized data after acceptance
export async function acceptInvite(token: string): Promise<{
    success: boolean;
    message: string;
    data: {
        personalized_message: string;
        meetup_time: string;
        vn_url?: string;
    };
}> {
    const response = await fetch(`${API_URL}/invite/${token}/accept`, {
        method: 'POST',
    });
    return handleResponse(response);
}

// Decline an invite
export async function declineInvite(token: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/invite/${token}/decline`, {
        method: 'POST',
    });
    return handleResponse<{ success: boolean; message: string }>(response);
}

// Search for music
export async function searchMusic(query: string, limit: number = 10): Promise<MusicSearchResponse> {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    const response = await fetch(`${API_URL}/music/search?${params}`);
    return handleResponse<MusicSearchResponse>(response);
}

// Upload voice note
export async function uploadVoiceNote(audioBlob: Blob): Promise<UploadVoiceNoteResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-note.webm');

    const response = await fetch(`${API_URL}/upload/voice-note`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse<UploadVoiceNoteResponse>(response);
}
