export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  pg: {
    type: 'postgres',
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10) || 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
});