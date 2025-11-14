'use strict';

import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import notificationService from './NotificationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class TravelArrangementService {
    constructor() {
        this.validationService = validationService;
        this.notificationService = notificationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FLIGHT ARRANGEMENTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async bookFlight(userId, bookingId, flightData) {
        try {
            if (!userId || !bookingId || !flightData) {
                throw new AppError('Required parameters missing', 400);
            }

            const result = await prisma.$transaction(async(tx) => {
                const booking = await tx.booking.findUnique({ where: { bookingId } });
                if (!booking) {
                    throw new AppError('Booking not found', 404);
                }

                const errors = this.validationService.validateFlightData(flightData);
                if (errors.length) {
                    throw new AppError(errors.join(', '), 400);
                }

                const flight = await tx.flight.create({
                    data: {
                        flightId: this._generateFlightId(),
                        bookingId: bookingId,
                        airline: flightData.airline,
                        flightNumber: flightData.flightNumber,
                        departureDate: flightData.departureDate,
                        departureTime: flightData.departureTime,
                        departureAirport: flightData.departureAirport,
                        arrivalDate: flightData.arrivalDate,
                        arrivalTime: flightData.arrivalTime,
                        arrivalAirport: flightData.arrivalAirport,
                        passengerCount: flightData.passengerCount,
                        price: flightData.price,
                        ticketNumber: flightData.ticketNumber || null,
                        seatNumbers: flightData.seatNumbers || [],
                        status: 'booked',
                        bookedAt: new Date()
                    }
                });

                await this.auditLogService.logAction({
                    action: 'FLIGHT_BOOKED',
                    entityType: 'Flight',
                    entityId: flight.flightId,
                    userId: userId,
                    details: { flightNumber: flightData.flightNumber, bookingId: bookingId }
                });

                return flight;
            });

            await this.notificationService.sendNotification(userId, 'FLIGHT_BOOKED', {
                flightNumber: flightData.flightNumber,
                departureDate: flightData.departureDate
            });

            return { success: true, message: 'Flight booked', flight: result };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getFlightsByBooking(bookingId) {
        try {
            if (!bookingId) throw new AppError('Booking ID required', 400);

            const flights = await prisma.flight.findMany({
                where: { bookingId: bookingId },
                orderBy: {
                    departureDate: 'asc'
                }
            });

            return { success: true, flights: flights, total: flights.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async cancelFlight(flightId, userId, reason) {
        try {
            if (!flightId || !userId) throw new AppError('Required params missing', 400);

            await prisma.$transaction(async(tx) => {
                const flight = await tx.flight.findUnique({ where: { flightId } });
                if (!flight) {
                    throw new AppError('Flight not found', 404);
                }

                await tx.flight.update({
                    where: { flightId },
                    data: {
                        status: 'cancelled',
                        cancellationReason: reason || null,
                        cancelledAt: new Date()
                    }
                });

                await this.auditLogService.logAction({
                    action: 'FLIGHT_CANCELLED',
                    entityType: 'Flight',
                    entityId: flightId,
                    userId: userId,
                    details: { reason: reason }
                });
            });

            return { success: true, message: 'Flight cancelled' };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOTEL ARRANGEMENTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async bookHotel(userId, bookingId, hotelData) {
        try {
            if (!userId || !bookingId || !hotelData) {
                throw new AppError('Required parameters missing', 400);
            }

            const result = await prisma.$transaction(async(tx) => {
                const booking = await tx.booking.findUnique({ where: { bookingId } });
                if (!booking) {
                    throw new AppError('Booking not found', 404);
                }

                const errors = this.validationService.validateHotelData(hotelData);
                if (errors.length) {
                    throw new AppError(errors.join(', '), 400);
                }

                const hotel = await tx.hotel.create({
                    data: {
                        hotelId: this._generateHotelId(),
                        bookingId: bookingId,
                        hotelName: hotelData.hotelName,
                        location: hotelData.location,
                        checkInDate: hotelData.checkInDate,
                        checkOutDate: hotelData.checkOutDate,
                        roomType: hotelData.roomType,
                        roomCount: hotelData.roomCount,
                        price: hotelData.price,
                        pricePerNight: hotelData.pricePerNight,
                        confirmationNumber: hotelData.confirmationNumber || null,
                        amenities: hotelData.amenities || [],
                        status: 'booked',
                        bookedAt: new Date()
                    }
                });

                await this.auditLogService.logAction({
                    action: 'HOTEL_BOOKED',
                    entityType: 'Hotel',
                    entityId: hotel.hotelId,
                    userId: userId,
                    details: { hotelName: hotelData.hotelName, bookingId: bookingId }
                });

                return hotel;
            });

            await this.notificationService.sendNotification(userId, 'HOTEL_BOOKED', {
                hotelName: hotelData.hotelName,
                checkInDate: hotelData.checkInDate
            });

            return { success: true, message: 'Hotel booked', hotel: result };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getHotelsByBooking(bookingId) {
        try {
            if (!bookingId) throw new AppError('Booking ID required', 400);

            const hotels = await prisma.hotel.findMany({
                where: { bookingId: bookingId }
            });

            return { success: true, hotels: hotels, total: hotels.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateHotelBooking(hotelId, userId, updateData) {
        try {
            if (!hotelId || !userId) throw new AppError('Required params missing', 400);

            const result = await prisma.$transaction(async(tx) => {
                const hotel = await tx.hotel.findUnique({ where: { hotelId } });
                if (!hotel) {
                    throw new AppError('Hotel not found', 404);
                }

                const dataToUpdate = {};
                if (updateData.checkInDate) dataToUpdate.checkInDate = updateData.checkInDate;
                if (updateData.checkOutDate) dataToUpdate.checkOutDate = updateData.checkOutDate;
                if (updateData.roomType) dataToUpdate.roomType = updateData.roomType;
                if (updateData.price) dataToUpdate.price = updateData.price;

                const updatedHotel = await tx.hotel.update({
                    where: { hotelId },
                    data: dataToUpdate
                });

                await this.auditLogService.logAction({
                    action: 'HOTEL_BOOKING_UPDATED',
                    entityType: 'Hotel',
                    entityId: hotelId,
                    userId: userId,
                    details: {}
                });

                return updatedHotel;
            });

            return { success: true, message: 'Updated', hotel: result };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async cancelHotel(hotelId, userId, reason) {
        try {
            if (!hotelId || !userId) throw new AppError('Required params missing', 400);

            await prisma.$transaction(async(tx) => {
                const hotel = await tx.hotel.findUnique({ where: { hotelId } });
                if (!hotel) {
                    throw new AppError('Hotel not found', 404);
                }

                await tx.hotel.update({
                    where: { hotelId },
                    data: {
                        status: 'cancelled',
                        cancellationReason: reason || null,
                        cancelledAt: new Date()
                    }
                });

                await this.auditLogService.logAction({
                    action: 'HOTEL_CANCELLED',
                    entityType: 'Hotel',
                    entityId: hotelId,
                    userId: userId,
                    details: { reason: reason }
                });
            });

            return { success: true, message: 'Cancelled' };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // TRANSPORTATION ARRANGEMENTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async bookTransportation(userId, bookingId, transportData) {
        try {
            if (!userId || !bookingId || !transportData) {
                throw new AppError('Required parameters missing', 400);
            }

            const result = await prisma.$transaction(async(tx) => {
                const booking = await tx.booking.findUnique({ where: { bookingId } });
                if (!booking) {
                    throw new AppError('Booking not found', 404);
                }

                const transport = await tx.transportation.create({
                    data: {
                        transportId: this._generateTransportId(),
                        bookingId: bookingId,
                        transportType: transportData.transportType,
                        pickupLocation: transportData.pickupLocation,
                        dropoffLocation: transportData.dropoffLocation,
                        pickupDate: transportData.pickupDate,
                        pickupTime: transportData.pickupTime,
                        vehicleType: transportData.vehicleType,
                        price: transportData.price,
                        confirmationCode: transportData.confirmationCode || null,
                        status: 'booked',
                        bookedAt: new Date()
                    }
                });

                await this.auditLogService.logAction({
                    action: 'TRANSPORTATION_BOOKED',
                    entityType: 'Transportation',
                    entityId: transport.transportId,
                    userId: userId,
                    details: { transportType: transportData.transportType }
                });

                return transport;
            });

            await this.notificationService.sendNotification(userId, 'TRANSPORTATION_BOOKED', {
                transportType: transportData.transportType,
                pickupDate: transportData.pickupDate
            });

            return { success: true, message: 'Transportation booked', transport: result };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getTransportationByBooking(bookingId) {
        try {
            if (!bookingId) throw new AppError('Booking ID required', 400);

            const transports = await prisma.transportation.findMany({
                where: { bookingId: bookingId },
                orderBy: {
                    pickupDate: 'asc'
                }
            });

            return { success: true, transports: transports, total: transports.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // COMPLETE TRAVEL ITINERARY
    // ═══════════════════════════════════════════════════════════════════════════════

    async getCompleteItinerary(bookingId, userId) {
        try {
            if (!bookingId || !userId) throw new AppError('Required params missing', 400);

            const booking = await prisma.bookings.findUnique({ where: { bookingId } });
            if (!booking) throw new AppError('Booking not found', 404);

            if (booking.userId !== userId && userId !== 'ADMIN') {
                throw new AppError('Unauthorized', 403);
            }

            const flights = await prisma.flight.findMany({ where: { bookingId: bookingId } });
            const hotels = await prisma.hotel.findMany({ where: { bookingId: bookingId } });
            const transports = await prisma.transportation.findMany({ where: { bookingId: bookingId } });

            const itinerary = {
                bookingId: bookingId,
                flights: flights,
                hotels: hotels,
                transportation: transports,
                totalCost: {
                    flights: flights.reduce((sum, f) => sum + f.price, 0),
                    hotels: hotels.reduce((sum, h) => sum + h.price, 0),
                    transportation: transports.reduce((sum, t) => sum + t.price, 0)
                }
            };

            itinerary.totalCost.grand_total = itinerary.totalCost.flights + itinerary.totalCost.hotels + itinerary.totalCost.transportation;

            return { success: true, itinerary: itinerary };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async generateTravelSummary(bookingId) {
        try {
            if (!bookingId) throw new AppError('Booking ID required', 400);

            const flights = await prisma.flight.findMany({ where: { bookingId: bookingId } });
            const hotels = await prisma.hotel.findMany({ where: { bookingId: bookingId } });
            const transports = await prisma.transportation.findMany({ where: { bookingId: bookingId } });

            let summary = '=== TRAVEL SUMMARY ===\n\n';

            if (flights.length) {
                summary += 'FLIGHTS:\n';
                flights.forEach(f => {
                    summary += `${f.airline} ${f.flightNumber} - ${f.departureDate} at ${f.departureTime}\n`;
                });
                summary += '\n';
            }

            if (hotels.length) {
                summary += 'HOTELS:\n';
                hotels.forEach(h => {
                    summary += `${h.hotelName} - Check-in: ${h.checkInDate}, Check-out: ${h.checkOutDate}\n`;
                });
                summary += '\n';
            }

            if (transports.length) {
                summary += 'TRANSPORTATION:\n';
                transports.forEach(t => {
                    summary += `${t.transportType} - ${t.pickupDate} at ${t.pickupTime}\n`;
                });
            }

            return { success: true, summary: summary };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateFlightId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'FLT-' + ts + rnd;
    }

    _generateHotelId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'HTL-' + ts + rnd;
    }

    _generateTransportId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'TRN-' + ts + rnd;
    }
}

export default new TravelArrangementService();