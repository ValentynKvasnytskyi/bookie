import mongoose from "mongoose";
import { BookingValidationErrors } from "../consts/errorMessages.ts";
export default class BookingValidationService {
    /**
     * Validates a booking against provider's schedule and existing bookings.
     * @param {Booking} booking - The booking document.
     * @param {Provider} provider - The provider document.
     * @param {Schedule} schedule - The schedule document.
     * @throws {Error} If any validation fails.
     */
    static async validateBooking(booking, provider, schedule) {
        await this.validateProviderSchedule(provider);
        const scheduleForDay = await this.validateBookingDay(booking, schedule);
        await this.validateBookingTime(booking, scheduleForDay);
        await this.validateNoConflicts(booking);
    }
    /**
     * Validates that the provider has a schedule.
     * @param {Provider} provider - The provider document.
     * @throws {Error} If the provider is not found or has no schedule.
     */
    static async validateProviderSchedule(provider) {
        if (!provider) {
            throw new Error(BookingValidationErrors.NoProvider);
        }
        else if (!provider.schedule) {
            throw new Error(BookingValidationErrors.NoProviderSchedule);
        }
    }
    /**
     * Validates that the booking day is available.
     * @param {Booking} booking - The booking document.
     * @param {Schedule} schedule - The schedule document.
     * @returns {Promise<ScheduleDay>} The schedule for the booking day.
     * @throws {Error} If the selected day is not available for booking.
     */
    static async validateBookingDay(booking, schedule) {
        const bookingDate = new Date(booking.startDate);
        const dayOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][bookingDate.getDay()];
        const scheduleForDay = schedule.days.find((day) => day.dayName === dayOfWeek);
        if (!scheduleForDay || scheduleForDay.isDayOff) {
            throw new Error(BookingValidationErrors.DayIsNotAvailable);
        }
        return scheduleForDay;
    }
    /**
     * Validates the booking time against the provider's schedule.
     * @param {Document & Booking} booking - The booking document.
     * @param {ScheduleDay} scheduleForDay - The schedule for the booking day.
     * @throws {Error} If the booking time is invalid.
     */
    static async validateBookingTime(booking, scheduleForDay) {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        if (startDate >= endDate) {
            throw new Error(BookingValidationErrors.StartEndDatesMismatch);
        }
        const startHour = startDate.getHours();
        const startMinute = startDate.getMinutes();
        const endHour = endDate.getHours();
        const endMinute = endDate.getMinutes();
        const isWithinWorkingHours = scheduleForDay.startHour &&
            startHour >= scheduleForDay.startHour &&
            scheduleForDay.endHour &&
            endHour <= scheduleForDay.endHour;
        if (!isWithinWorkingHours) {
            throw new Error(BookingValidationErrors.ProviderWorkingHours);
        }
        if (scheduleForDay.breakTime) {
            const bookingStartTime = startHour * 60 + startMinute;
            const bookingEndTime = endHour * 60 + endMinute;
            const breakStartTime = scheduleForDay.breakTime.startHour * 60 + scheduleForDay.breakTime.startMinute;
            const breakEndTime = scheduleForDay.breakTime.endHour * 60 + scheduleForDay.breakTime.endMinute;
            const isOverlappingBreak = bookingStartTime < breakEndTime && bookingEndTime > breakStartTime;
            if (isOverlappingBreak) {
                throw new Error(BookingValidationErrors.ProviderBreakTime);
            }
        }
    }
    /**
     * Validates that there are no conflicting bookings.
     * @param {Document & Booking} booking - The booking document.
     * @throws {Error} If there is a conflicting booking.
     */
    static async validateNoConflicts(booking) {
        const Bookings = mongoose.model("Bookings");
        const conflictingBooking = await Bookings.findOne({
            provider: booking.provider,
            isDeclined: false,
            $or: [
                { startDate: { $lt: booking.endDate }, endDate: { $gt: booking.startDate } },
                { startDate: { $gte: booking.startDate, $lt: booking.endDate } },
                { endDate: { $gt: booking.startDate, $lte: booking.endDate } },
            ],
        });
        if (conflictingBooking) {
            throw new Error(BookingValidationErrors.SlotHasBeenBooked);
        }
    }
}
