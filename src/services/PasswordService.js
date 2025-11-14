// Password Service - Password management utilities
// NO optional chaining - Production Ready
import crypto from 'crypto';
import bcrypt from 'bcrypt';

class PasswordService {
    // ========== GENERATE STRONG PASSWORD ==========
    generateStrongPassword(length = 16) {
        try {
            const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const lowercase = 'abcdefghijklmnopqrstuvwxyz';
            const numbers = '0123456789';
            const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

            const allChars = uppercase + lowercase + numbers + special;

            let password = '';
            password += uppercase[Math.floor(Math.random() * uppercase.length)];
            password += lowercase[Math.floor(Math.random() * lowercase.length)];
            password += numbers[Math.floor(Math.random() * numbers.length)];
            password += special[Math.floor(Math.random() * special.length)];

            for (let i = password.length; i < length; i++) {
                password += allChars[Math.floor(Math.random() * allChars.length)];
            }

            password = password.split('').sort(() => Math.random() - 0.5).join('');

            return { success: true, password };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CHECK PASSWORD STRENGTH ==========
    checkPasswordStrength(password) {
        try {
            if (!password || typeof password !== 'string') {
                return {
                    valid: false,
                    score: 0,
                    level: 'Invalid',
                    feedback: ['Password must be a non-empty string'],
                };
            }

            const strength = {
                score: 0,
                level: 'Weak',
                feedback: [],
                requirements: {
                    minLength: false,
                    hasUppercase: false,
                    hasLowercase: false,
                    hasNumbers: false,
                    hasSpecial: false,
                },
            };

            if (password.length >= 8) {
                strength.score++;
                strength.requirements.minLength = true;
            } else {
                strength.feedback.push('Password must be at least 8 characters');
            }

            if (/[A-Z]/.test(password)) {
                strength.score++;
                strength.requirements.hasUppercase = true;
            } else {
                strength.feedback.push('Add uppercase letters (A-Z)');
            }

            if (/[a-z]/.test(password)) {
                strength.score++;
                strength.requirements.hasLowercase = true;
            } else {
                strength.feedback.push('Add lowercase letters (a-z)');
            }

            if (/[0-9]/.test(password)) {
                strength.score++;
                strength.requirements.hasNumbers = true;
            } else {
                strength.feedback.push('Add numbers (0-9)');
            }

            if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
                strength.score++;
                strength.requirements.hasSpecial = true;
            } else {
                strength.feedback.push('Add special characters (!@#$%^&*)');
            }

            if (strength.score <= 2) {
                strength.level = 'Weak';
            } else if (strength.score <= 3) {
                strength.level = 'Fair';
            } else if (strength.score <= 4) {
                strength.level = 'Good';
            } else {
                strength.level = 'Strong';
            }

            return { success: true, ...strength };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== HASH PASSWORD ==========
    async hashPassword(password, saltRounds = 10) {
        try {
            if (!password || typeof password !== 'string') {
                return { success: false, error: 'Password must be a non-empty string' };
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            return { success: true, hash: hashedPassword };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== VERIFY PASSWORD ==========
    async verifyPassword(password, hash) {
        try {
            if (!password || !hash) {
                return { success: false, error: 'Password and hash are required' };
            }

            const isValid = await bcrypt.compare(password, hash);

            return { success: true, isValid };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GENERATE SALT ==========
    generateSalt(length = 16) {
        try {
            const salt = crypto.randomBytes(length).toString('hex');
            return { success: true, salt };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CHECK PASSWORD SIMILARITY ==========
    checkPasswordSimilarity(newPassword, oldPassword) {
        try {
            const similarity = this.calculateSimilarity(newPassword, oldPassword);

            if (similarity > 0.8) {
                return {
                    success: false,
                    error: 'New password is too similar to old password',
                    similarity: (similarity * 100).toFixed(2),
                };
            }

            return {
                success: true,
                message: 'Passwords are sufficiently different',
                similarity: (similarity * 100).toFixed(2),
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== VALIDATE PASSWORD FORMAT ==========
    validatePasswordFormat(password, rules = {}) {
        try {
            const defaultRules = {
                minLength: 8,
                maxLength: 128,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecial: true,
            };

            const finalRules = {...defaultRules, ...rules };
            const errors = [];

            if (password.length < finalRules.minLength) {
                errors.push(`Password must be at least ${finalRules.minLength} characters`);
            }

            if (password.length > finalRules.maxLength) {
                errors.push(`Password must not exceed ${finalRules.maxLength} characters`);
            }

            if (finalRules.requireUppercase && !/[A-Z]/.test(password)) {
                errors.push('Password must contain uppercase letters');
            }

            if (finalRules.requireLowercase && !/[a-z]/.test(password)) {
                errors.push('Password must contain lowercase letters');
            }

            if (finalRules.requireNumbers && !/[0-9]/.test(password)) {
                errors.push('Password must contain numbers');
            }

            if (finalRules.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
                errors.push('Password must contain special characters');
            }

            return {
                success: errors.length === 0,
                errors,
                valid: errors.length === 0,
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CALCULATE PASSWORD ENTROPY ==========
    calculatePasswordEntropy(password) {
        try {
            let charsetSize = 0;

            if (/[a-z]/.test(password)) charsetSize += 26;
            if (/[A-Z]/.test(password)) charsetSize += 26;
            if (/[0-9]/.test(password)) charsetSize += 10;
            if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) charsetSize += 32;

            const entropy = password.length * Math.log2(charsetSize);

            return {
                success: true,
                entropy: entropy.toFixed(2),
                bits: Math.round(entropy),
                charsetSize,
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== HELPER: CALCULATE SIMILARITY ==========
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    // ========== HELPER: LEVENSHTEIN DISTANCE ==========
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }
}

export { PasswordService };
export default new PasswordService();