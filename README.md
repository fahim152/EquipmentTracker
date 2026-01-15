# Equipment Tracker

Real-time equipment monitoring and order management system for factory floor.


## Prerequisites

- Docker Desktop installed

## Installation and Running

### Using Docker (Recommended)

**Start the application:**
```bash
docker-compose up -d
```

**Wait for services to start** (approximately 30-40 seconds)

**Access the application:**
- Frontend: http://localhost:3050
- Backend API: http://localhost:5156
- API Documentation: http://localhost:5156/swagger
- Pulsar Admin: http://localhost:8040

**Note:** Docker automatically installs all dependencies and builds the application. No manual setup required. All services start in parallel.

**Stop the application:**
```bash
docker-compose down
```

**Clean restart (removes all data):**
```bash
docker-compose down -v
docker-compose up -d
```

### Port Configuration

**Docker Deployment (default):**
- Frontend: External `3050` → Internal `80`
- Backend: External `5156` → Internal `8080`
- Pulsar Broker: External `6689` → Internal `6650`
- Pulsar Admin: External `8040` → Internal `8080`

**Why different ports?**
- External ports avoid conflicts with common services (Node, .NET, etc.) running on developer machines
- Internal container ports use standard conventions
- All services communicate via Docker network using internal ports

**To change external ports:**
1. Copy `.env.example` to `.env`
2. Edit port numbers as needed
3. Run `docker-compose up -d`

### Local Development (Without Docker)

**Backend:**
```bash
cd EquipmentTracker
dotnet run
```
Backend runs on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000 and connects to backend at http://localhost:5000

**Pulsar (optional):**
- Not required for local development
- Application works without Pulsar (events won't publish)
- Check http://localhost:5000/health to verify system status

## Features

### HMI Interface Tab
- Equipment scanner input for quick access
- State change buttons (Red, Yellow, Green)
- Current order information display
- Production progress tracking
- Scheduled orders queue
- Recent change history

### Monitor Tab
- Grid view of all equipment
- Real-time state updates via SignalR
- Equipment selection for detailed view
- Complete history tracking

### Supervisor Tab
- Production overview dashboard
- Active orders monitoring
- Equipment-to-order correlation
- Production progress metrics
- Scheduled order queue management
- Order history by equipment
- Real-time state and order tracking

## Sample Data

The application includes:
- 21 equipment items across different production stages
- 10 sample product orders
- Order scheduling and assignment
- Production progress tracking
- Complete state change history

## Testing Real-Time Updates

1. Open http://localhost:3050 in two browser tabs
2. First tab: Go to HMI Interface, select equipment, change state
3. Second tab: Go to Monitor or Supervisor, watch updates instantly
4. All connected clients receive real-time updates via SignalR

## Implementation Status

### Frontend UI Implemented

**Equipment Management:**
- View all equipment
- Change equipment state (Red/Yellow/Green)
- View equipment state history
- Real-time state updates

**Order Display:**
- View current orders
- View scheduled orders
- View order progress
- Equipment-to-order correlation

**Dashboards:**
- HMI Interface (Operator)
- Monitor Dashboard (Central display)
- Supervisor Dashboard (Management overview)

### Backend API Only (No UI)

**Order Management:**
- Update order status (POST /order/{id}/status/{status})
- Update order progress (POST /order/{id}/progress)
- Schedule orders (POST /order/schedule)

These backend APIs are fully functional and tested, but order management UI forms were not implemented due to time constraints. The Supervisor Dashboard displays all order information.

## API Endpoints

Equipment:
- GET /equipment - List all equipment
- GET /equipment/{id} - Get equipment details
- POST /equipment/{id}/state - Change equipment state
- GET /equipment/history - Get all state changes
- GET /equipment/{id}/history - Get equipment state history

Orders:
- GET /order - List all orders
- GET /order/{id} - Get order details
- GET /order/equipment/{equipmentId} - Orders by equipment
- GET /order/status/{status} - Orders by status
- POST /order - Create new order
- PUT /order/{id} - Update order
- DELETE /order/{id} - Delete order
- POST /order/{id}/status/{status} - Update order status (Pending/Scheduled/InProgress/Completed/Cancelled)
- POST /order/{id}/progress - Update production progress
- GET /order/scheduled - List scheduled orders
- POST /order/schedule - Schedule an order

## Technology Stack

- Frontend: React 18, TypeScript, React Query, SignalR Client, Chakra UI
- Backend: ASP.NET Core 9.0, SignalR, Entity Framework Core
- Database: SQLite
- Messaging: Apache Pulsar
- Deployment: Docker, Docker Compose, Nginx

## Architecture

**Services:**
- `frontend`: React SPA served via Nginx
- `backend`: ASP.NET Core REST API + SignalR hub
- `pulsar`: Apache Pulsar message broker (optional)
- Docker network for inter-service communication
- Persistent volumes for data storage

**Data Flow:**
1. User changes equipment state → Backend API
2. Backend updates database → Broadcasts via SignalR (Always works)
3. Backend publishes event to Pulsar (async, fire-and-forget) - Optional - silently fails if Pulsar is down
4. All connected clients receive instant updates via SignalR (Always works)

**Important: Pulsar is Optional**
- Equipment state changes work WITHOUT Pulsar
- Real-time updates work WITHOUT Pulsar (via SignalR)
- Database persists all changes
- Only Pulsar event publishing is disabled if Pulsar is down
- Check system status: http://localhost:5156/health or http://localhost:5000/health

## Data Persistence

Data is stored in Docker volumes and persists between container restarts:
- `backend-data`: SQLite database with equipment and orders
- `pulsar-data`: Pulsar message broker data

To reset all data:
```bash
docker-compose down -v
```

## Troubleshooting

**Port conflicts:**
If you see errors about ports already in use:
1. Check what's using the port: `lsof -i :3050` (or 5156, 6689, 8040)
2. Either stop that service or change the port in docker-compose.yml
3. Restart: `docker-compose up -d`

**Services not starting:**
```bash
docker-compose logs <service-name>
```
Replace `<service-name>` with `frontend`, `backend`, or `pulsar`

**Pulsar takes long to start:**
- Normal behavior: Pulsar needs 30-40 seconds on first startup
- Check status: `docker-compose logs pulsar`
- Services start in parallel - frontend/backend don't wait for Pulsar
- If Pulsar fails, the application still works! Only event publishing is disabled.

**Pulsar is down but application works:**
- This is normal and expected behavior
- Equipment state changes still work
- Real-time updates via SignalR still work
- Database saves all changes
- Only the Pulsar event publishing is disabled
- Check `/health` endpoint to see Pulsar status

**Frontend can't connect to backend:**
- Check all services are running: `docker-compose ps`
- All should show "Up" status
- Check backend logs: `docker-compose logs backend`
- Check frontend logs: `docker-compose logs frontend`
- Verify network: `docker network ls` should show `equipment-tracker-network`

**Complete reset:**
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

**View logs in real-time:**
```bash
docker-compose logs -f
```
