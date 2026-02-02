import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    return await SQLite.openDatabase({ name: 'pillIdentifier.db', location: 'default' });
  } catch (error) {
    console.error('❌ Failed to open database:', error);
    throw error;
  }
};

// Delete the database file from disk
export const deleteDatabase = async (): Promise<void> => {
  try {
    await SQLite.deleteDatabase({ name: 'pillIdentifier.db', location: 'default' });
    console.log('🗑️ Database deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting database:', error);
    throw error;
  }
};

export const initializeDatabase = async (): Promise<void> => {
  const db = await getDBConnection();

  const createPillBookmarkTable = `
    CREATE TABLE IF NOT EXISTS pills_bookmark (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_name TEXT NOT NULL,
      labeler TEXT,
      mpc_imprint TEXT
    );
  `;

  const createPrescriptionTable = `
    CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image1 TEXT NOT NULL,
    image2 TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;

  const createRemindersTable = `
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_name TEXT NOT NULL,
      shape TEXT NOT NULL,
      instructions TEXT NOT NULL,
      shapeimage TEXT NOT NULL,
      time TEXT NOT NULL,
      is_taken BOOLEAN DEFAULT 0,
      taken_date TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // Create tables if they do not exist
    await db.executeSql(createPillBookmarkTable);
    console.log('✅ pills_bookmark table created');

    await db.executeSql(createRemindersTable);
    console.log('✅ reminders table created');

    await db.executeSql(createPrescriptionTable);
    console.log('✅ prescriptions table created');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export const resetDatabase = async (): Promise<void> => {
  const db = await getDBConnection();

  const dropTables = `
    DROP TABLE IF EXISTS pills_bookmark;
    DROP TABLE IF EXISTS reminders;
  `;

  const createPillBookmarkTable = `
    CREATE TABLE IF NOT EXISTS pills_bookmark (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_name TEXT NOT NULL,
      labeler TEXT,
      mpc_imprint TEXT
    );
  `;

  const createPrescriptionTable = `
    CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image1 TEXT NOT NULL,
    image2 TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;

  const createRemindersTable = `
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_name TEXT NOT NULL,
      shape TEXT NOT NULL,
      instructions TEXT NOT NULL,
      shapeimage TEXT NOT NULL,
      time TEXT NOT NULL,
      is_taken BOOLEAN DEFAULT 0,
      taken_date TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // Drop old tables
    const dropResult = await db.executeSql(dropTables);
    console.log('🗑️ All tables dropped:', dropResult);

    // Create fresh tables
    await db.executeSql(createPillBookmarkTable);
    console.log('✅ pills_bookmark table created');

    await db.executeSql(createRemindersTable);
    console.log('✅ reminders table created');

    await db.executeSql(createPrescriptionTable);
    console.log('✅ prescriptions table created');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
};
