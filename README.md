# AI System Starter

AI System Starter is a comprehensive platform for managing and deploying AI models with ease. This project integrates a modern frontend built with React and Vite, a robust backend powered by FastAPI, and a PostgreSQL database along with monitoring using Prometheus and Grafana.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Setup (Optional)](#docker-setup-optional)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [GitHub Actions & Deployment](#github-actions--deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

AI System Starter provides an end-to-end solution which includes:

- **Model Management:** Easily deploy and manage different AI models such as object detection, segmentation, and pose estimation.
- **Real-time Analysis:** Process and analyze data in real-time with an intuitive user interface.
- **Camera Management:** Monitor and control multiple camera streams.
- **Monitoring & Alerts:** Integrated with Prometheus and Grafana to keep track of system metrics and alerts.
- **Theming & Responsive Design:** Utilizes Material-UI (MUI) for a responsive and themed UI.

## Features

- **Frontend:** Developed in React using Vite for fast builds and hot module replacement.
- **Backend:** Built with FastAPI providing RESTful endpoints and real-time processing.
- **Database:** Uses PostgreSQL for data storage.
- **Monitoring:** Uses Prometheus (with exporters) and Grafana dashboards for visualizing system metrics.
- **Containerization:** Docker support with a Dockerfile and docker-compose configuration.

## Prerequisites

- **Node.js** (v14+ recommended)
- **Python** (v3.10+ recommended)
- **Docker** (if you plan to run the project containerized)
- **PostgreSQL** (or use the provided Docker configuration)

## Installation

### Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment:**
   ```bash
   python -m venv venv
   # On Linux/macOS:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install backend dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend application:**
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   # or if you use yarn:
   yarn
   ```

3. **Run the frontend development server:**
   ```bash
   npm run dev
   # or using yarn:
   yarn dev
   ```

Your frontend application will typically run on a port specified by Vite (e.g., http://localhost:3000) and will automatically proxy API requests to the backend at `http://localhost:8000`.

### Docker Setup (Optional)

If you prefer running the entire project using Docker, you can use the provided Docker configuration.

1. **Using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   This command will start:
   - **PostgreSQL** on port `5433` (mapping internal port 5432)
   - **Prometheus** on port `9090`
   - **Grafana** on port `3001`
   - Your backend application container (if configured in the Dockerfile)

## Running the Application

1. **Backend:**  
   Start the FastAPI backend (if not using Docker):
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Frontend:**  
   Start the React frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the UI:**  
   Open your browser and navigate to the port configured by Vite (e.g., http://localhost:3000).

## Project Structure

```bash
.
├── backend
│   ├── main.py               # FastAPI main application
│   ├── db_settings.py        # Database setup and initialization
│   ├── models.py             # SQLAlchemy models (not shown but included)
│   └── ...                   # Other backend related code
├── frontend
│   ├── src
│   │   ├── App.jsx           # Main React component with routing and theming
│   │   ├── pages             # Page components (e.g., Home, Dashboard, LiveAnalysis, Settings)
│   │   ├── hooks             # Custom hooks (e.g., useThemeToggle)
│   │   └── ...               # Other frontend components
│   ├── index.html            # HTML template for the app
│   ├── package.json          # Frontend dependencies and scripts
│   └── vite.config.js        # Vite configuration
├── docker-compose.yml        # Docker Compose configuration for multi-container deployment
├── Dockerfile                # Dockerfile for the FastAPI backend
├── .github
│   └── workflows
│       └── main_voyagedelta.yml   # GitHub Actions workflow for Azure deployment
└── README.md                 # This file
```

## GitHub Actions & Deployment

A GitHub Actions workflow is provided under `.github/workflows/main_voyagedelta.yml`. This workflow will build and deploy the Python backend to Azure Web Apps. Make sure to configure your Azure deployment secrets in the repository settings.

## Troubleshooting

- **Database Connection:**  
  Verify that your database URL in `backend/db_settings.py` matches your PostgreSQL instance. If using Docker, ensure ports match the docker-compose configuration.

- **Port Conflicts:**  
  If you encounter issues with port conflicts, update the configuration in `docker-compose.yml` or your local environment variables accordingly.

- **Dependency Issues:**  
  Double-check the versions in `requirements.txt` for Python and `package.json` for Node modules if you run into compatibility problems.

## Contributing

Contributions are welcome! Please submit issues or pull requests for any improvements, bug fixes, or feature requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [Material-UI](https://mui.com/)

