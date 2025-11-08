'use strict';

import { Flight, Booking } from '../models/index.js';
import { cacheService } from '../config/redis.js';

export class FlightService {
    async createFlight(data) {
        if (!data.flightNumber || !data.departureCity || !data.arrivalCity) {
            return { success: false, error: 'Required fields missing' };
        }
        try {
            const flight = await Flight.create({
                flightNumber: data.flightNumber,
                airline: data.airline,
                departureCity: data.departureCity,
                arrivalCity: data.arrivalCity,
                departureDate: data.departureDate,
                arrivalDate: data.arrivalDate,
                departureTime: data.departureTime,
                arrivalTime: data.arrivalTime,
                price: data.price,
                currency: data.currency || 'INR',
                availableSeats: data.availableSeats,
                totalSeats: data.totalSeats,
                isActive: true
            });

            await cacheService.delete('flights');
            return { success: true, data: flight };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async listFlights(filters) {
        try {
            const where = { isActive: true };
            if (filters.departureCity) where.departureCity = filters.departureCity;
            if (filters.arrivalCity) where.arrivalCity = filters.arrivalCity;
            if (filters.departureDate) where.departureDate = filters.departureDate;
            if (filters.priceMin || filters.priceMax) {
                where.price = {};
                if (filters.priceMin) where.price[require('sequelize').Op.gte] = filters.priceMin;
                if (filters.priceMax) where.price[require('sequelize').Op.lte] = filters.priceMax;
            }

            const cacheKey = `flights_${JSON.stringify(where)}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: JSON.parse(cached) };

            const flights = await Flight.findAll({ where, order: [
                    ['price', 'ASC']
                ] });
            await cacheService.set(cacheKey, JSON.stringify(flights), 3600);

            return { success: true, data: flights };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async bookFlight(flightId, userId, seatCount) {
        try {
            const flight = await Flight.findByPk(flightId);
            if (!flight) return { success: false, error: 'Flight not found' };
            if (flight.availableSeats < seatCount) return { success: false, error: 'Not enough seats' };

            await flight.update({ availableSeats: flight.availableSeats - seatCount });
            const booking = await Booking.create({
                userId,
                flightId,
                seatCount,
                totalPrice: seatCount * flight.price,
                status: 'confirmed'
            });

            return { success: true, data: { flight, booking } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async cancelBooking(bookingId) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if (!booking) return { success: false, error: 'Booking not found' };
            const flight = await Flight.findByPk(booking.flightId);
            await booking.destroy();
            if (flight) await flight.update({ availableSeats: flight.availableSeats + booking.seatCount });
            return { success: true, message: 'Cancelled' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export const flightService = new FlightService();
export default flightService;