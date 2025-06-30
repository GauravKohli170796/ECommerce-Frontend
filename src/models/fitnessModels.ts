import { ReactNode } from "react";

interface WalkRecord {
    _id: string;
    email: string;
    walkDateTime: string; // or Date if you'll convert it
    distanceKm: number;
    durationMinutes: number;
    caloriesBurned: number;
    goalDistanceKm: number;
    goalDurationMinutes: number;
    goalCaloriesBurned: number;
    note: string;
    __v: number;
}

export interface SummaryEntry {
    _id: null;
    totalDistance: number;
    totalDuration: number;
    totalCalories: number;
    goalCaloriesBurned: number,
    goalDistanceKm: number,
    goalDurationMinutes: number,
    goalStepsWalk: number,
    totalDays: number,
    records?: WalkRecord[]; // Only present in last30Entries
}

export interface FitnessData {
    last7Days: SummaryEntry[];
    last30Days: SummaryEntry[];
    allTime: SummaryEntry[];
    totalCount: { count: number }[]
}

export interface FitnessWidgetProps {
    title: string;
    totalDistance: number,
    totalDuration: number,
    totalCalories: number,
    goalCaloriesBurned: number,
    goalDistanceKm: number,
    goalDurationMinutes: number,
    totalSteps: number,
    goalStepsWalk: number,
    totalDays: number,
}
