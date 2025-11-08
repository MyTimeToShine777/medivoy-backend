'use strict';

import { flightService } from '../services/FlightService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

export class FlightController {
    async createFlight(req, res, next) {
        try {
            const result = await flightService.createFlight(req.body);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(201).json(ResponseFormatter.created(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async listFlights(req, res, next) {
        try {
            const filters = {
                departureCity: req.query.departureCity,
                arrivalCity: req.query.arrivalCity,
                departureDate: req.query.departureDate,
                priceMin: req.query.priceMin,
                priceMax: req.query.priceMax
            };
            const result = await flightService.listFlights(filters);
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async bookFlight(req, res, next) {
        try {
            if (!req.body.seatCount || !req.params.flightId) {
                return res.status(400).json(ResponseFormatter.error('Flight and seat count required', 400));
            }
            const result = await flightService.bookFlight(req.params.flightId, req.user.userId, req.body.seatCount);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(201).json(ResponseFormatter.created(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async cancelBooking(req, res, next) {
        try {
            if (!req.params.bookingId) {
                return res.status(400).json(ResponseFormatter.error('Booking ID required', 400));
            }
            const result = await flightService.cancelBooking(req.params.bookingId);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(200).json(ResponseFormatter.success({}));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }
}

export default new FlightController();