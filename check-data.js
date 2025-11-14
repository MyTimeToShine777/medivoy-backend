import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async() => {
    try {
        const users = await prisma.users.count();
        const doctors = await prisma.doctors.count();
        const hospitals = await prisma.hospitals.count();
        const treatments = await prisma.treatments.count();

        console.log('\n=== DATABASE CONTENT CHECK ===');
        console.log('  Users:', users);
        console.log('  Doctors:', doctors);
        console.log('  Hospitals:', hospitals);
        console.log('  Treatments:', treatments);
        console.log('\n✓ Database has schema but', (users + doctors + hospitals + treatments) === 0 ? 'NO DATA' : 'HAS DATA');

        await prisma.$disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
})();