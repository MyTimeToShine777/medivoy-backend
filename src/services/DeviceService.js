'use strict';

import { Device } from '../models/index.js';
import UAParser from 'ua-parser-js';

export class DeviceService {
    // ═══════════════════════════════════════════════════════════════════════════════
    // PARSE DEVICE INFO
    // ═══════════════════════════════════════════════════════════════════════════════

    parseDeviceInfo(userAgent) {
        try {
            const parser = new UAParser(userAgent);
            const result = parser.getResult();

            return {
                name: `${result.browser.name || 'Unknown'} on ${result.os.name || 'Unknown'}`,
                type: result.device.type || 'desktop',
                browser: result.browser.name || 'Unknown',
                browserVersion: result.browser.version || 'Unknown',
                os: result.os.name || 'Unknown',
                osVersion: result.os.version || 'Unknown',
                userAgent: userAgent
            };
        } catch (error) {
            console.error('❌ Parse device error:', error.message);
            return {
                name: 'Unknown Device',
                type: 'unknown',
                browser: 'Unknown',
                os: 'Unknown',
                userAgent: userAgent
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // REGISTER DEVICE
    // ═══════════════════════════════════════════════════════════════════════════════

    async registerDevice(userId, userAgent, ipAddress) {
        try {
            const deviceInfo = this.parseDeviceInfo(userAgent);

            let device = await Device.findOne({
                where: { userId, userAgent }
            });

            if (device) {
                // Update existing device
                await device.update({
                    lastLoginAt: new Date(),
                    ipAddress,
                    isActive: true
                });
            } else {
                // Create new device
                device = await Device.create({
                    userId,
                    name: deviceInfo.name,
                    type: deviceInfo.type,
                    browser: deviceInfo.browser,
                    browserVersion: deviceInfo.browserVersion,
                    os: deviceInfo.os,
                    osVersion: deviceInfo.osVersion,
                    userAgent,
                    ipAddress,
                    isActive: true,
                    lastLoginAt: new Date()
                });
            }

            console.log(`✅ Device registered: ${device.name}`);

            return device;
        } catch (error) {
            console.error('❌ Register device error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GET USER DEVICES
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserDevices(userId) {
        try {
            const devices = await Device.findAll({
                where: { userId, isActive: true },
                order: [
                    ['lastLoginAt', 'DESC']
                ]
            });

            return devices;
        } catch (error) {
            console.error('❌ Get devices error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // REMOVE DEVICE
    // ═══════════════════════════════════════════════════════════════════════════════

    async removeDevice(deviceId, userId) {
        try {
            await Device.update({ isActive: false }, { where: { deviceId, userId } });

            console.log(`✅ Device removed: ${deviceId}`);

            return true;
        } catch (error) {
            console.error('❌ Remove device error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // REMOVE ALL DEVICES
    // ═══════════════════════════════════════════════════════════════════════════════

    async removeAllDevices(userId) {
        try {
            await Device.update({ isActive: false }, { where: { userId } });

            console.log(`✅ All devices removed for user: ${userId}`);

            return true;
        } catch (error) {
            console.error('❌ Remove all devices error:', error.message);
            throw error;
        }
    }
}

export const deviceService = new DeviceService();
export default deviceService;