import { Document } from "mongoose";

export type Schedule = Document<ScheduleEntity> & ScheduleEntity;
export interface ScheduleEntity {
  _id?: string;
  days: ScheduleDay[];
}

export interface ScheduleDay {
  startHour: number | null;
  endHour: number | null;
  startMinute: number | null;
  endMinute: number | null;
  dayName: string;
  isDayOff: boolean;
  index: number;
  breakTime: ScheduleBreakTime | null;
}

export interface ScheduleBreakTime {
  startHour: number;
  endHour: number;
  startMinute: number;
  endMinute: number;
}
