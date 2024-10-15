export var BookingValidationErrors;
(function (BookingValidationErrors) {
    BookingValidationErrors["NoProvider"] = "Provider not found ";
    BookingValidationErrors["NoProviderSchedule"] = "Provider has no schedule";
    BookingValidationErrors["DayIsNotAvailable"] = "Selected day is not available for booking";
    BookingValidationErrors["StartEndDatesMismatch"] = "Start date must be earlier than end date";
    BookingValidationErrors["ProviderWorkingHours"] = "Selected time is outside the provider's working hours";
    BookingValidationErrors["ProviderBreakTime"] = "Selected time overlaps with the provider's break time";
    BookingValidationErrors["SlotHasBeenBooked"] = "Selected slot is already booked";
    BookingValidationErrors["NoHours"] = "No hours";
})(BookingValidationErrors || (BookingValidationErrors = {}));
