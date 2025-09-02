import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@studymate.com' },
    update: {},
    create: {
      email: 'demo@studymate.com',
      password: hashedPassword,
      name: 'Demo User',
      preferences: JSON.stringify({
        theme: 'dark',
        notifications: true,
        studyReminders: true
      })
    }
  });

  console.log('✅ Created user:', user.email);

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Complete React Project',
        description: 'Finish the StudyMate frontend application with all components',
        subject: 'Web Development',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        estimatedTime: 240, // 4 hours
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        tags: JSON.stringify(['react', 'frontend', 'project']),
        attachments: JSON.stringify([]),
        userId: user.id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Study Database Design',
        description: 'Learn about database normalization and optimization',
        subject: 'Database Systems',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        estimatedTime: 120, // 2 hours
        priority: 'MEDIUM',
        status: 'PENDING',
        tags: JSON.stringify(['database', 'sql', 'design']),
        attachments: JSON.stringify([]),
        userId: user.id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Read API Documentation',
        description: 'Review REST API best practices and documentation standards',
        subject: 'Software Engineering',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        estimatedTime: 60, // 1 hour
        priority: 'LOW',
        status: 'PENDING',
        tags: JSON.stringify(['api', 'documentation', 'best-practices']),
        attachments: JSON.stringify([]),
        userId: user.id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Complete Math Assignment',
        description: 'Solve calculus problems from chapters 3-5',
        subject: 'Mathematics',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        estimatedTime: 180, // 3 hours
        priority: 'HIGH',
        status: 'PENDING',
        tags: JSON.stringify(['math', 'calculus', 'homework']),
        attachments: JSON.stringify([]),
        userId: user.id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Prepare Presentation',
        description: 'Create slides for the final project presentation',
        subject: 'Communication',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        estimatedTime: 90, // 1.5 hours
        priority: 'MEDIUM',
        status: 'PENDING',
        tags: JSON.stringify(['presentation', 'slides', 'communication']),
        attachments: JSON.stringify([]),
        userId: user.id
      }
    })
  ]);

  console.log('✅ Created', tasks.length, 'sample tasks');

  // Create another user for testing
  const user2 = await prisma.user.upsert({
    where: { email: 'test@studymate.com' },
    update: {},
    create: {
      email: 'test@studymate.com',
      password: hashedPassword,
      name: 'Test User',
      preferences: JSON.stringify({
        theme: 'light',
        notifications: false,
        studyReminders: true
      })
    }
  });

  console.log('✅ Created user:', user2.email);

  // Create a task for the second user
  await prisma.task.create({
    data: {
      title: 'Learn TypeScript',
      description: 'Study TypeScript fundamentals and advanced features',
      subject: 'Programming',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      estimatedTime: 300, // 5 hours
      priority: 'MEDIUM',
      status: 'PENDING',
      tags: JSON.stringify(['typescript', 'programming', 'learning']),
      attachments: JSON.stringify([]),
      userId: user2.id
    }
  });

  console.log('✅ Created task for second user');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Sample Data Created:');
  console.log(`👤 Users: ${user.email}, ${user2.email}`);
  console.log(`📝 Tasks: ${tasks.length + 1} total tasks`);
  console.log(`🔑 Demo Login: ${user.email} / password123`);
  console.log(`🔑 Test Login: ${user2.email} / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
