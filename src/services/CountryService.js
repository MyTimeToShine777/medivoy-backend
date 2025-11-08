// Country Service - Country management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { Country } from '../models/index.js';

class CountryService {
    // ========== GET COUNTRY ==========
    async getCountryById(countryId) {
        try {
            const country = await Country.findByPk(countryId);
            if (!country) return { success: false, error: 'Not found' };
            return { success: true, data: country };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET ALL COUNTRIES ==========
    async getAllCountries() {
        try {
            const countries = await Country.findAll({
                order: [
                    ['name', 'ASC']
                ],
            });

            return { success: true, data: countries };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== SEARCH COUNTRIES ==========
    async searchCountries(searchTerm) {
        try {
            const countries = await Country.findAll({
                where: {
                    [Op.or]: [{
                            name: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        },
                        {
                            code: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        },
                    ],
                },
            });

            return { success: true, data: countries };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new CountryService();