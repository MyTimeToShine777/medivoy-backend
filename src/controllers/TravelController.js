'use strict';

import { TravelArrangementService } from '../services/TravelArrangementService.js';

export class TravelController {
    constructor() {
        this.travelService = new TravelArrangementService();
    }

    async bookFlight(req, res) {
        try {
            const userId = req.user.userId;
            const bookingId = req.params.bookingId;
            const flightData = req.body;

            const result = await this.travelService.bookFlight(userId, bookingId, flightData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Flight booked',
                data: result.flight
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getFlightsByBooking(req, res) {
        try {
            const bookingId = req.params.bookingId;

            const result = await this.travelService.getFlightsByBooking(bookingId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.flights,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async cancelFlight(req, res) {
        try {
            const flightId = req.params.flightId;
            const userId = req.user.userId;
            const reason = req.body.reason;

            const result = await this.travelService.cancelFlight(flightId, userId, reason);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Flight cancelled'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async bookHotel(req, res) {
        try {
            const userId = req.user.userId;
            const bookingId = req.params.bookingId;
            const hotelData = req.body;

            const result = await this.travelService.bookHotel(userId, bookingId, hotelData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Hotel booked',
                data: result.hotel
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getHotelsByBooking(req, res) {
        try {
            const bookingId = req.params.bookingId;

            const result = await this.travelService.getHotelsByBooking(bookingId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.hotels,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateHotelBooking(req, res) {
        try {
            const hotelId = req.params.hotelId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.travelService.updateHotelBooking(hotelId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Hotel updated',
                data: result.hotel
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async bookTransportation(req, res) {
        try {
            const userId = req.user.userId;
            const bookingId = req.params.bookingId;
            const transportData = req.body;

            const result = await this.travelService.bookTransportation(userId, bookingId, transportData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Transportation booked',
                data: result.transport
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getCompleteItinerary(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;

            const result = await this.travelService.getCompleteItinerary(bookingId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.itinerary
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async generateTravelSummary(req, res) {
        try {
            const bookingId = req.params.bookingId;

            const result = await this.travelService.generateTravelSummary(bookingId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                summary: result.summary
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new TravelController();