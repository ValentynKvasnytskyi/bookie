import mongoose from "mongoose";
import bookingSchema from "./bookings.schema.ts";
import ClientsCreationService from "../../services/ClientsCreationService.ts";
import BookingValidationService from "../../services/BookingValidationService.ts";
bookingSchema.pre("save", async function (next) {
    try {
        await ClientsCreationService.checkAndCreateBookingClient(this);
        if (this.isNew) {
            const Providers = mongoose.model("Providers");
            const provider = await Providers.findById(this.provider);
            const Schedule = mongoose.model("Schedules");
            const schedule = await Schedule.findById(provider.schedule);
            await BookingValidationService.validateBooking(this, provider, schedule);
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
const Bookings = mongoose.model("Bookings", bookingSchema);
export default Bookings;
