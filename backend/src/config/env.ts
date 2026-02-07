import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the backend root directory
// __dirname is in backend/src/config (or backend/dist/config when compiled)
// So we need to go up two directories to reach backend/.env
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export default {};
