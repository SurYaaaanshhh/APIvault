#! /usr/bin/env bash

set -x

# Let the DB start
python app/backend_pre_start.py || true

# Run migrations
alembic upgrade head || true

# Create initial data in DB
python app/initial_data.py || true
