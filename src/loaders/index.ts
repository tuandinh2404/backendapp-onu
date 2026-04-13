import expressLoader from './express';
import sequelizeLoader from './sequelize';
import Logger from './logger';

export default async ({ expressApp }) => {
  // Kết nối PostgreSQL
  await sequelizeLoader();
  Logger.info('✌️ DB loaded and connected!');

  // Load Express
  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};