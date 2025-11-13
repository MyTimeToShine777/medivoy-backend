// Country Service - Country management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class CountryService {
    // ========== GET COUNTRY ==========
    async getCountryById(countryId) {
        try {
            const country = await prisma.country.findUnique({
                where: { countryId }
            });
            if (!country) return { success: false, error: 'Not found' };
            return { success: true, data: country };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET ALL COUNTRIES ==========
    async getAllCountries() {
        try {
            const countries = await prisma.country.findMany({
                orderBy: { name: 'asc' }
            });

            return { success: true, data: countries };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== SEARCH COUNTRIES ==========
    async searchCountries(searchTerm) {
        try {
            const countries = await prisma.country.findMany({
                where: {
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { code: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                }
            });

            return { success: true, data: countries };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new CountryService();