pipeline {
    // 1. CHỌN AGENT
    // Chạy trên bất kỳ agent nào có sẵn
    agent any

    // 2. BIẾN MÔI TRƯỜNG
    // Tất cả các biến bạn định nghĩa trong script
    environment {
        IMAGE_NAME = 'client'
        IMAGE_TAG = '1.0'
        REGISTRY_HOST = 'idg-repository.hcmtelecom.vn'
        REGISTRY_NAMESPACE = 'gpa_sanpham_dev'
        DOCKERFILE_PATH = 'WebClient/Dockerfile.test' // Bỏ ./ vì Jenkins chạy từ gốc workspace
        BUILD_CONTEXT = '.'

        // Tự động tạo tên image đầy đủ
        FULL_IMAGE_NAME = "${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"

        // !!! QUAN TRỌNG:
        // Đây là ID của credential "Username with password" bạn đã lưu trong Jenkins
        // Nó sẽ dùng để đăng nhập vào Docker registry của bạn.
        REGISTRY_CREDS_ID = 'idg-repository-creds' // <--- THAY ĐỔI ID NÀY
    }

    // 3. CÁC GIAI ĐOẠN (STAGES)
    stages {
        stage('Demo Stage') {
            steps {
              sh """
                ls -la
                """
                    // Dùng """ để bọc các lệnh shell nhiều dòng
                    sh """
                docker build \
                  -f "${DOCKERFILE_PATH}" \
                  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  --build-arg no_proxy=*.hcmtelecom.vn \
                  "${BUILD_CONTEXT}"
                """
            }
        }

        // --- Giai đoạn 2: Tag Image ---
        stage('Tag') {
            steps {
                echo "Bước 2: Tagging image as ${FULL_IMAGE_NAME}"
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${FULL_IMAGE_NAME}"
            }
        }

        // --- Giai đoạn 3: Push lên Registry ---
        // stage('Push') {
        //     steps {
        //         echo "Bước 3: Pushing image to registry..."

        //         // Đây là cách an toàn để xử lý mật khẩu trong Jenkins.
        //         // Nó sẽ tự động nạp username/password từ ID credential ở trên.
        //         withCredentials([usernamePassword(credentialsId: "${REGISTRY_CREDS_ID}",
        //                                            usernameVariable: 'REG_USER',
        //                                            passwordVariable: 'REG_PASS')]) {

        //             // 1. Đăng nhập vào registry
        //             sh "docker login ${REGISTRY_HOST} -u ${REG_USER} -p ${REG_PASS}"

    //             // 2. Push image
    //             sh "docker push ${FULL_IMAGE_NAME}"
    //         }
    //     }
    // }
    }

// 4. SAU KHI HOÀN TẤT (Dọn dẹp)
// post {
//     always {
//         // Luôn đăng xuất khỏi registry sau khi chạy xong (dù thành công hay thất bại)
//         // để đảm bảo an toàn, không lưu credential trên agent.
//         echo "Hoàn thành! Đăng xuất khỏi ${REGISTRY_HOST}"
//         sh "docker logout ${REGISTRY_HOST}"
//     }
// }
}
