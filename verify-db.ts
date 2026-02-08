import { db, users, projects } from './shared/db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function verify() {
    console.log('--- DB Verification ---');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');

    try {
        // 1. Check users
        console.log('\n1. Checking Users...');
        const allUsers = await db.select().from(users);
        console.log(`Found ${allUsers.length} users.`);

        let guestUser = allUsers.find(u => u.id === 1);
        if (!guestUser) {
            console.log('Guest user (ID: 1) NOT found. Creating it...');
            await db.insert(users).values({
                id: 1,
                openId: 'guest-user-openid',
                name: 'Guest User',
                email: 'guest@crux.local',
                role: 'admin',
                subscriptionTier: 'premium',
            });
            console.log('Guest user created.');
        } else {
            console.log('Guest user exists:', guestUser.name);
        }

        // 2. Check projects
        console.log('\n2. Checking Projects...');
        const allProjects = await db.select().from(projects);
        console.log(`Found ${allProjects.length} projects.`);

        // 3. Try test insert
        console.log('\n3. Attempting test insert...');
        const testId = randomUUID();
        await db.insert(projects).values({
            id: testId,
            userId: 1,
            name: 'Test Project ' + new Date().toISOString(),
            initialInvestment: 1000,
            yearlyRevenue: 5000,
            operatingCosts: 2000,
            maintenanceCosts: 500,
            projectDuration: 12,
            discountRate: 10,
            revenueGrowth: 5,
            bestCaseMultiplier: 1.2,
            worstCaseMultiplier: 0.8,
        });
        console.log('Test project inserted successfully with ID:', testId);

        // 4. Verify insert
        const [verified] = await db.select().from(projects).where(eq(projects.id, testId));
        if (verified) {
            console.log('SUCCESS: Project was found in DB.');
        } else {
            console.log('FAILURE: Project was not found after insert.');
        }

    } catch (error) {
        console.error('CRITICAL ERROR:', error);
    } finally {
        process.exit();
    }
}

verify();
