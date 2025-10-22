import app from './app.ts';
import connecctDB from './config/db.ts';
import { ENV } from './config/env.ts';

const PORT = ENV.PORT || 8084;

// start server

(async () => {
  try {
    await connecctDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
