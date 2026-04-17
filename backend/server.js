import app from './src/app.js';
import connecttodb from './src/config/database.js';

const PORT = process.env.PORT || 3000;

connecttodb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
