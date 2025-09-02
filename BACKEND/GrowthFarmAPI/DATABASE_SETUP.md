# Growth Farm Database Setup

This document explains how to set up and manage the database for the Growth Farm API.

## Database Schema

The database uses the following tables with the `_GrowthFarm` suffix:

- `users_GrowthFarm` - User accounts and profiles
- `farms_GrowthFarm` - Farm information and details  
- `farm_zones_GrowthFarm` - Farm zones and crop management
- `marketplace_products_GrowthFarm` - Products for sale in marketplace
- `orders_GrowthFarm` - Purchase orders and transactions
- `order_items_GrowthFarm` - Individual items within orders

## Quick Setup

### Option 1: Automatic Setup (Recommended)

The server will automatically create and synchronize database tables when started:

```bash
npm run dev
```

or

```batch
dev.bat
```

### Option 2: Manual Database Sync

Use the database synchronization scripts:

**Windows Batch:**
```batch
sync-db.bat
```

**PowerShell:**
```powershell
.\sync-db.ps1
```

**Node.js:**
```bash
# Safe sync (alter existing tables)
node src/scripts/sync-database.js --alter

# Force reset (recreate all tables - WARNING: deletes data!)
node src/scripts/sync-database.js --force
```

### Option 3: Manual SQL Setup

If you prefer to set up the database manually:

1. Import the SQL schema:
```sql
-- Execute the contents of src/database/schema.sql in your MySQL database
```

2. The schema file is located at: `src/database/schema.sql`

## Database Configuration

Make sure your `.env` file contains the correct database settings:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=growth_farm_db

# Server Configuration  
API_SERVER_HOST=192.168.0.112
API_SERVER_PORT=3000
```

## Model Relationships

### User Relationships
- User → Farms (one-to-many)
- User → FarmZones as Manager (one-to-many)
- User → MarketplaceProducts as Seller (one-to-many)
- User → Orders as Buyer (one-to-many)
- User → Orders as Seller (one-to-many)

### Farm Relationships  
- Farm → User as Owner (many-to-one)
- Farm → FarmZones (one-to-many)

### Marketplace Relationships
- MarketplaceProduct → User as Seller (many-to-one)
- Order → User as Buyer (many-to-one)
- Order → User as Seller (many-to-one)
- Order → OrderItems (one-to-many)
- OrderItem → Order (many-to-one)
- OrderItem → MarketplaceProduct (many-to-one)

## Database Operations

### Check Connection
```bash
node -e "const db = require('./src/config/database'); db.authenticate().then(() => console.log('✅ Connected')).catch(err => console.error('❌ Failed:', err));"
```

### View Tables
```sql
SHOW TABLES LIKE '%_GrowthFarm';
```

### Reset Database (Development Only)
```bash
# WARNING: This will delete all data!
node src/scripts/sync-database.js --force
```

## Troubleshooting

### Connection Issues
1. Check database server is running
2. Verify credentials in `.env`
3. Ensure database `growth_farm_db` exists
4. Check firewall/network settings

### Table Issues  
1. Run database sync: `node src/scripts/sync-database.js --alter`
2. Check for naming conflicts
3. Verify model definitions match schema

### Data Issues
1. Check foreign key constraints
2. Verify required fields are provided
3. Ensure data types match model definitions

## Development Tips

1. **Always backup before reset**: The `--force` option deletes all data
2. **Use alter mode**: `--alter` is safer for development
3. **Check logs**: Server logs show database sync status
4. **Test connection**: Use the connection test before troubleshooting

## Production Deployment

For production:

1. Set `NODE_ENV=production` in `.env`
2. Use database migrations instead of sync
3. Set up proper database backups
4. Use connection pooling for better performance
5. Monitor database performance and logs

## API Endpoints

After database setup, these endpoints will be available:

- `GET /health` - Health check (includes DB status)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /farms` - List farms
- `GET /marketplace/products` - List products
- `POST /ai/chat` - AI assistant

For detailed API documentation, start the server and visit the health endpoint.
