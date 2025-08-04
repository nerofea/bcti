#!/bin/bash

PROJECT_NAME="alice_login_check"
CIRCUIT_DIR="./circuits/$PROJECT_NAME"

# Create circuit project if not exists
if [ ! -d "$CIRCUIT_DIR" ]; then
  noir new $CIRCUIT_DIR
fi

# Copy template logic (overwrite main.nr)
cp ./templates/$PROJECT_NAME.nr $CIRCUIT_DIR/src/main.nr

# Compile and generate proving & verifying keys
cd $CIRCUIT_DIR
nargo compile
nargo prove
nargo verify
