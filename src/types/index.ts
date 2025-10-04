
export type TelemedicineSession = {
    id: string;
    patientId: string;
    chwId: string;
    specialistId: string;
    sessionStartTime: string;
    sessionEndTime: string;
    status: 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
    sessionRecordingUri?: string;
    chatTranscript?: string;
    sessionOutcomes?: string;
    qualityRating?: number;
    webRtcIntegrationDetails?: string;
    sessionAnalytics?: string;
};
