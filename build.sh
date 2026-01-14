#!/bin/bash

set -e  # Stop script if any command fails

############################################
# FIXED CONFIGURATION
############################################
SERVICE_NAME="web-client"
IMAGE_NAME="web-client"
IMAGE_TAG="1.0"

BUILD_CONTEXT="."

TAR_FILE="${SERVICE_NAME}_${IMAGE_TAG}.tar"

REMOTE_USER="khanhnv.hcm"
REMOTE_HOST="10.70.31.58"
REMOTE_PORT="22022"
REMOTE_DIR="/home/khanhnv.hcm@vnpttphcm.vn/images"
REMOTE_TAR_PATH="${REMOTE_DIR}/${TAR_FILE}"

echo "======================================"
echo " Building image ${IMAGE_NAME}:${IMAGE_TAG}"
echo "======================================"

############################################
# Step 1: Build Docker image
############################################
docker build --platform linux/amd64 -t "${IMAGE_NAME}:${IMAGE_TAG}" "${BUILD_CONTEXT}"

echo "--------------------------------------"
echo " Step 2: Export image to tar file"
echo "--------------------------------------"

docker save -o "${TAR_FILE}" "${IMAGE_NAME}:${IMAGE_TAG}"

echo "Created tar: ${TAR_FILE}"

############################################
# Step 3: Upload tar via SCP
############################################
echo "--------------------------------------"
echo " Step 3: Upload tar via SCP"
echo "--------------------------------------"

scp -i ~/.ssh/id_rsa_mac_58 -P "${REMOTE_PORT}" "${TAR_FILE}" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"

echo "Upload completed successfully."

############################################
# Step 4: Delete local tar file
############################################
echo "--------------------------------------"
echo " Step 4: Delete local tar file"
echo "--------------------------------------"

rm -f "${TAR_FILE}"

echo "Local tar file deleted: ${TAR_FILE}"

echo "======================================"
echo " Done! Image exported and uploaded."
echo " Remote file path:"
echo "     ${REMOTE_TAR_PATH}"
echo "--------------------------------------"
echo " To update the service on server, run:"
echo
echo " 1. Stop and remove old container:"
echo "    docker rm -f ${SERVICE_NAME}"
echo
echo " 2. Remove old image (optional):"
echo "    docker rmi ${SERVICE_NAME}:${IMAGE_TAG}"
echo
echo " 3. Load new image:"
echo "    docker load -i ${REMOTE_TAR_PATH}"
echo
echo " 4. Run container again:"
echo "    docker run -d --name ${SERVICE_NAME} -p 7000:80 ${SERVICE_NAME}:${IMAGE_TAG}"
echo
echo "======================================"
