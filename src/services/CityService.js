// City Service - City management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { City, Country } from '../models/index.js';

class CityService {
    // ========== GET CITY ==========
    async getCityById(cityId) {
        try {
            const city = await City.findByPk(cityId, {
                include: [{ model: Country, as: 'country' }],
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
            const cities = await City.findAll({
                where: { countryId },
                order: [
                    ['name', 'ASC']
                ],
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
                name: {
                    [Op.iLike]: `%${searchTerm}%`
                },
            };

            if (countryId) {
                where.countryId = countryId;
            }

            const cities = await City.findAll({ where });

            return { success: true, data: cities };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new CityService();