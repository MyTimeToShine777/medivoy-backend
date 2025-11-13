// City Service - City management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class CityService {
    // ========== GET CITY ==========
    async getCityById(cityId) {
        try {
            const city = await prisma.city.findUnique({
                where: { cityId },
                include: { country: true }
            });

            if (!city) return { success: false, error: 'Not found' };
            return { success: true, data: city };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET CITIES BY COUNTRY ==========
    async getCitiesByCountry(countryId) {
        try {
            const cities = await prisma.city.findMany({
                where: { countryId },
                orderBy: { name: 'asc' }
            });

            return { success: true, data: cities };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== SEARCH CITIES ==========
    async searchCities(searchTerm, countryId = null) {
        try {
            const where = {
                name: { contains: searchTerm, mode: 'insensitive' }
            };

            if (countryId) {
                where.countryId = countryId;
            }

            const cities = await prisma.city.findMany({ where });

            return { success: true, data: cities };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new CityService();