// Valentine Invite Platform - Type Definitions

export type InviteState = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface CreateInviteRequest {
    val_name: string;           // Required - Valentine's name/nickname
    creator_name: string;       // Required - Your name
    creator_email: string;      // Required - Email for notifications
    teaser_text: string;        // Required - Shown before accept
    personalized_message: string; // Required - Revealed after accept
    vn_url?: string;            // Optional - Voice note URL from upload
    music_provider: 'YOUTUBE';  // Required - Always YOUTUBE
    music_track_id: string;     // Required - YouTube video ID
    music_start_sec: number;    // Required - Start time in seconds
    music_end_sec: number;      // Required - End time (max 30s clip)
    meetup_time: string;        // Required - ISO date-time
    expires_at?: string;        // Optional - Defaults to 7 days
}

export interface CreateInviteResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        token: string;
        link: string;      // Full shareable link
        expires_at: string;
    }
}

export interface InviteResponse {
    id: string;
    val_name: string;
    creator_name: string;
    teaser_text: string;
    music_provider: 'YOUTUBE';
    music_track_id: string;
    music_start_sec: number;
    music_end_sec: number;
    meetup_time: string;
    state: InviteState;
    expires_at: string;
    created_at: string;
    // Only included when state === 'ACCEPTED':
    personalized_message?: string;
    vn_url?: string;
}

export interface MusicTrack {
    trackId: string;
    title: string;
    artist: string;
    duration: number;      // In seconds
    thumbnailUrl: string;
}

export interface MusicSearchResponse {
    success: boolean;
    data: {
        query: string;
        count: number;
        tracks: MusicTrack[];
    };
}

export interface UploadVoiceNoteResponse {
    success: boolean;
    message: string;
    data: {
        url: string;
    }
}
