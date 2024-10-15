export enum BookingValidationErrors {
  NoProvider = "Provider not found ",
  NoProviderSchedule = "Provider has no schedule",
  DayIsNotAvailable = "Selected day is not available for booking",
  StartEndDatesMismatch = "Start date must be earlier than end date",
  ProviderWorkingHours = "Selected time is outside the provider's working hours",
  ProviderBreakTime = "Selected time overlaps with the provider's break time",
  SlotHasBeenBooked = "Selected slot is already booked",
  NoHours = "No hours",
}
