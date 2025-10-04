import { Timestamp } from "firebase/firestore";

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

export type HealthEducationContent = {
    id: string;
    title: string;
    category: string;
    summary: string;
    imageId: string;
};

export type Consultation = {
    id: string;
    symptoms: string;
    preliminaryDiagnosis: string;
    riskAssessment: string;
    confidenceScore: number;
    patientId: string;
    consultationDate: Timestamp;
};
