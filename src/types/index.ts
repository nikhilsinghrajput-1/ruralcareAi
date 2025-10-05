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
    recommendedAction?: string;
    patientId: string;
    consultationDate: Timestamp;
    suggestedTaskTitle?: string;
};

export type Specialist = {
    id: string;
    name: string;
    specialty: string;
    location: string;
    imageUrl: string;
};

export type Referral = {
    id?: string;
    patientId: string;
    specialistId: string;
    specialistName: string; // Denormalized for display
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    notes: string;
    createdAt: any;
};

export type Task = {
    id?: string;
    title: string;
    description?: string;
    patientId?: string;
    patientName?: string; // Denormalized
    dueDate?: any;
    priority: 'Low' | 'Medium' | 'High';
    status: 'pending' | 'completed';
    createdAt: any;
};

export type UserVaccineRecord = {
    id?: string;
    vaccineId: string;
    dateAdministered: any;
    status: 'completed';
};
