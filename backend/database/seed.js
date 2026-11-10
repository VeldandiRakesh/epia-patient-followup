const db = require('../config/database');

const samplePatients = [
  {
    name: 'John Smith',
    phone: '5551234567',
    consultation_date: '2024-11-01',
    follow_up_date: new Date().toISOString().split('T')[0], // Today
    status: 'Pending'
  },
  {
    name: 'Sarah Johnson',
    phone: '5552345678',
    consultation_date: '2024-11-02',
    follow_up_date: new Date().toISOString().split('T')[0], // Today
    status: 'Pending'
  },
  {
    name: 'Michael Brown',
    phone: '5553456789',
    consultation_date: '2024-10-25',
    follow_up_date: '2024-11-15',
    status: 'Pending'
  },
  {
    name: 'Emily Davis',
    phone: '5554567890',
    consultation_date: '2024-10-20',
    follow_up_date: '2024-11-10',
    status: 'Completed'
  },
  {
    name: 'David Wilson',
    phone: '5555678901',
    consultation_date: '2024-10-28',
    follow_up_date: '2024-11-12',
    status: 'Pending'
  },
  {
    name: 'Jessica Martinez',
    phone: '5556789012',
    consultation_date: '2024-10-30',
    follow_up_date: new Date().toISOString().split('T')[0], // Today
    status: 'Pending'
  },
  {
    name: 'Robert Taylor',
    phone: '5557890123',
    consultation_date: '2024-10-15',
    follow_up_date: '2024-11-05',
    status: 'Completed'
  },
  {
    name: 'Amanda Anderson',
    phone: '5558901234',
    consultation_date: '2024-11-03',
    follow_up_date: '2024-11-18',
    status: 'Pending'
  }
];

function seedDatabase() {
  console.log('Seeding database with sample patients...');

  const query = `
    INSERT INTO patients (name, phone, consultation_date, follow_up_date, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  samplePatients.forEach((patient, index) => {
    db.run(
      query,
      [patient.name, patient.phone, patient.consultation_date, patient.follow_up_date, patient.status],
      function(err) {
        if (err) {
          console.error(`Error inserting patient ${index + 1}:`, err.message);
        } else {
          console.log(`Inserted patient: ${patient.name} (ID: ${this.lastID})`);
        }
      }
    );
  });

  setTimeout(() => {
    console.log('Database seeding completed!');
    console.log('Sample patients added:', samplePatients.length);
    process.exit(0);
  }, 1000);
}

seedDatabase();
