import mongoose from "mongoose";
export default class ClientsCreationService {
    /**
     * Checks if a client exists and creates a new one if not.
     * @param {Booking} booking - The booking document.
     * @returns {Promise<void>}
     */
    static async checkAndCreateBookingClient(booking) {
        if (!booking.isModified("client") && typeof booking.client !== "object") {
            return;
        }
        const Clients = mongoose.model("Clients");
        const clientData = booking.client;
        let client = await Clients.findOne({
            $or: [{ email: clientData.email }, { phoneNumber: clientData.phoneNumber }, { name: clientData.name }],
        });
        if (!client) {
            client = new Clients(clientData);
            await client.save();
        }
        booking.client = client._id;
    }
}
