'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';

export class FlightService {
    async createFlight(data) {
        if (!data.flightNumber || !data.departureCity || !data.arrivalCity) {
            return { success: false, error: 'Required fields missing' };
        }
        try {
            const flight = await prisma.flight.create({
                data: {
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
                }
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
                if (filters.priceMin) where.price.gte = filters.priceMin;
                if (filters.priceMax) where.price.lte = filters.priceMax;
            }

            const cacheKey = `flights_${JSON.stringify(where)}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: JSON.parse(cached) };

            const flights = await prisma.flight.findMany({
                where,
                orderBy: { price: 'asc' }
            });
            await cacheService.set(cacheKey, JSON.stringify(flights), 3600);

            return { success: true, data: flights };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async bookFlight(flightId, userId, seatCount) {
        try {
            const flight = await prisma.flight.findUnique({
                where: { flightId }
            });
            if (!flight) return { success: false, error: 'Flight not found' };
            if (flight.availableSeats < seatCount) return { success: false, error: 'Not enough seats' };

            const updatedFlight = await prisma.flight.update({
                where: { flightId },
                data: { availableSeats: flight.availableSeats - seatCount }
            });
            const booking = await prisma.booking.create({
                data: {
                    userId,
                    flightId,
                    seatCount,
                    totalPrice: seatCount * flight.price,
                    status: 'confirmed'
                }
            });

            return { success: true, data: { flight: updatedFlight, booking } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async cancelBooking(bookingId) {
        try {
            const booking = await prisma.booking.findUnique({ where: { bookingId: bookingId } });
            if (!booking) return { success: false, error: 'Booking not found' };
            const flight = await prisma.flight.findUnique({ where: { flightId: booking.flightId } });
            await prisma.booking.delete({
                where: { bookingId: booking.bookingId }
            });
            if (flight) await flight.update({ availableSeats: flight.availableSeats + booking.seatCount });
            return { success: true, message: 'Cancelled' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export const flightService = new FlightService();
export default flightService;