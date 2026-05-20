require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Ethiopian Calendar API running on port ${PORT}`);
  console.log(`📅 API Documentation: http://localhost:${PORT}`);
  console.log(`✅ Conversion API: http://localhost:${PORT}/api/conversion`);
  console.log(`📆 Calendar API: http://localhost:${PORT}/api/calendar`);
});