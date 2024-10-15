import mongoose from "mongoose";
import { Booking } from "../entities/bookings/bookings.types.ts";
import { Client } from "../entities/clients/clients.types.ts";

export default class ClientsCreationService {
  /**
   * Checks if a client exists and creates a new one if not.
   * @param {Booking} booking - The booking document.
   * @returns {Promise<void>}
   */
  static async checkAndCreateBookingClient(booking: Booking): Promise<void> {
    if (!booking.isModified("client") && typeof booking.client !== "object") {
      return;
    }

    const Clients = mongoose.model("Clients");
    const clientData = booking.client as Client;

    let client = await Clients.findOne({
      $and: [{ email: clientData.email }, { phoneNumber: clientData.phoneNumber }],
    });

    if (!client) {
      client = new Clients(clientData);
      await client.save();
    }

    booking.client = client._id;
  }
}
