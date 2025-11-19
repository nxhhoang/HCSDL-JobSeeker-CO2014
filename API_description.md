# **Thiết kế API**

## **1. Quy chuẩn chung (Conventions)**

* **URL Base:** `/api/v1`
* **Authentication:**

  * Headers: `Authorization: Bearer <access_token>`
* **Response Format (JSON):**

```json
{
  "message": "Mô tả kết quả (Thành công/Lỗi)",
  "data": {},
  "error"?: null
}
```
- Cụ thể:

```json
{
  "message": "string",
  "data": "object | array | null",
  "error"?: "object | null"
}
```

---

## **2. Chi tiết các Module**

### **2.1 Module Authentication (Xác thực & Phân quyền)**

*Dựa trên bảng `USER` và các bảng con `CANDIDATE`, `EMPLOYER`.*

| Method   | Endpoint                | Mô tả & Logic nghiệp vụ                                                                            |                                                                                             |
| -------- | ----------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **POST** | `/auth/register`        | **Đăng ký tài khoản mới.**<br>Payload: `{username, password, email, phone, name, role: 'candidate' \| 'employer'}`.<br>Lưu ý: Trigger tạo bản ghi tương ứng trong bảng `Candidate`hoặc`Employer`. |
| **POST** | `/auth/login`           | **Đăng nhập** (Email/Phone + Password).<br>Trả về `accessToken`, `refreshToken`, `user_info`.      |                                                                                             |
| **POST** | `/auth/refresh-token`   | **Cấp lại Access Token mới** từ Refresh Token.                                                     |                                                                                             |
| **POST** | `/auth/verify-otp`      | **Xác thực tài khoản** (User chỉ active sau khi xác thực email/phone).                             |                                                                                             |
| **POST** | `/auth/forgot-password` | **Gửi OTP** để reset mật khẩu.                                                                     |                                                                                             |
| **POST** | `/auth/reset-password`  | **Đặt mật khẩu mới.** Cần OTP xác thực trước.                                                      |                                                                                             
---

### **2.2 Module Users (Người dùng chung)**

*Thao tác trên bảng `USER` và `PERSON`.*

| Method   | Endpoint           | Mô tả & Logic nghiệp vụ                                                                              |
| -------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| **GET**  | `/users/me`        | Lấy thông tin profile cá nhân hiện tại.                                                              |
| **PUT**  | `/users/me`        | Cập nhật thông tin cơ bản (Name, Address, DOB...).<br>Validate: Kiểm tra tuổi > 18 nếu là Candidate. |
| **POST** | `/users/me/avatar` | Upload ảnh đại diện.                                                                                 |

---

### **2.3 Module Candidate (Ứng viên)**

*Thao tác trên `CANDIDATE`, `JOB_HISTORY`, `OWN` (Skills).*

| Method   | Endpoint                     | Mô tả & Logic nghiệp vụ                            |
| -------- | ---------------------------- | -------------------------------------------------- |
| **GET**  | `/candidates/:id`            | Xem profile công khai của ứng viên (cho Employer). |
| **PUT**  | `/candidates/me/cv`          | Upload/Cập nhật CV mặc định.                       |
| **GET**  | `/candidates/me/job-history` | Lấy danh sách lịch sử làm việc.                    |
| **POST** | `/candidates/me/job-history` | Thêm lịch sử làm việc (`JOB_HISTORY`).             |
| **PUT**  | `/candidates/me/skills`      | Cập nhật kỹ năng (`OWN` — N-N với Skill).          |

---

### **2.4 Module Employer & Company (Nhà tuyển dụng)**

*Thao tác trên `EMPLOYER`, `COMPANY`, `PERSON`.*

| Method   | Endpoint                   | Mô tả & Logic nghiệp vụ                                        |
| -------- | -------------------------- | -------------------------------------------------------------- |
| **POST** | `/companies`               | Tạo profile công ty.<br>Validate: TaxNumber, Website hợp lệ.   |
| **PUT**  | `/employers/me`            | Cập nhật thông tin Employer. Nếu là công ty, update `COMPANY`. |
| **GET**  | `/employers/:id`           | Lấy thông tin chi tiết nhà tuyển dụng.                         |
| **GET**  | `/employers/:id/followers` | Xem danh sách người theo dõi (`FOLLOW`).                       |

---

### **2.5 Module Jobs (Việc làm)**

*Thao tác trên `JOB`, `JOB_DESCRIPTION`, `REQUIRE`, `IN`.*

| Method     | Endpoint           | Mô tả & Logic nghiệp vụ                                                                                                                       |
| ---------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**    | `/jobs`            | **Tìm kiếm việc làm.**<br>Params: `?q=keyword&loc=city&salary_min=x&skill=java&cat=backend`.                                                  |
| **GET**    | `/jobs/:id`        | **Xem chi tiết việc làm**, gồm cả mô tả và danh sách skill yêu cầu.                                                                           |
| **POST**   | `/jobs/post`            | **Đăng tin tuyển dụng** (Employer).<br>Payload: `{job_info, jd_info, skills[], categories[]}`.<br>Chỉ đăng khi Employer đã cập nhật Tax/Info. |
| **PUT**    | `/jobs/update/:id`        | Cập nhật tin tuyển dụng.                                                                                                                      |
| **DELETE** | `/jobs/delete/:id`        | **Đóng/Xóa job.**<br>Không thể xóa nếu còn hồ sơ chưa xử lý.                                                                                  |
| **POST**   | `/jobs/:id/relate` | Gắn job liên quan (`RELATE`).                                                                                                                 |

---

### **2.6 Module Application (Ứng tuyển)**

*Thao tác trên bảng `APPLY`.*

| Method     | Endpoint                 | Mô tả & Logic nghiệp vụ                                                                                                                |
| ---------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **POST**   | `/jobs/:id/apply`        | **Nộp đơn.**<br>Payload: `{cv_url (optional), cover_letter}`.<br>Check: đã apply chưa, job còn hạn, dùng CV mặc định nếu không upload. |
| **GET**    | `/candidates/me/applies` | Xem lịch sử ứng tuyển.                                                                                                                 |
| **GET**    | `/jobs/:id/applies`      | Employer xem danh sách ứng viên nộp vào job này.                                                                                       |
| **PUT**    | `/applies/:id/status`    | Cập nhật trạng thái (`Applied`, `Shortlisted`, `Interviewed`, `Accepted`, `Rejected`).                                                 |
| **DELETE** | `/applies/:id`           | **Rút hồ sơ** (chỉ khi job chưa hết hạn).                                                                                              |

---

### **2.7 Module Interaction (Tương tác)**

*Thao tác trên `MESSAGE`, `NOTIFY`, `FOLLOW`, `FEEDBACK`, `SENDMSG`.*

| Method   | Endpoint                  | Mô tả & Logic nghiệp vụ                                                      |
| -------- | ------------------------- | ---------------------------------------------------------------------------- |
| **POST** | `/employers/:id/follow`   | Toggle Follow/Unfollow Employer.                                             |
| **POST** | `/jobs/:id/feedback`      | Đánh giá Job.<br>Chỉ khi status trong `APPLY` là `Accepted` hoặc `Finished`. |
| **GET**  | `/messages`               | Lấy lịch sử tin nhắn. Params: `?with_user_id=xyz`.                           |
| **POST** | `/messages`               | Gửi tin nhắn (tạo `MESSAGE` & `SENDMSG`).                                    |
| **GET**  | `/notifications`          | Lấy danh sách thông báo.                                                     |
| **PUT**  | `/notifications/:id/read` | Đánh dấu đã đọc.                                                             |

---

### **2.8 Module Metadata (Dữ liệu danh mục)**

| Method  | Endpoint      | Mô tả                                      |
| ------- | ------------- | ------------------------------------------ |
| **GET** | `/skills`     | Lấy danh sách kỹ năng (`SKILL`).           |
| **GET** | `/categories` | Lấy danh sách ngành nghề (`JOB_CATEGORY`). |

---

## **3. Lưu ý phát triển**

### **TypeScript Interfaces**

* Nên tạo Interface tương ứng với bảng DB.
* `IUser`: Thông tin user cơ bản.
* `IJob`: Merge bảng `JOB` + `JOB_DESCRIPTION`.
* `IApply`: Bao gồm enum trạng thái.

### **Stored Procedures gợi ý**

* `Trigger before_apply_insert`: Kiểm tra apply trùng, kiểm tra ngày hết hạn.
* `sp_search_jobs`: Tối ưu tìm kiếm nhiều tiêu chí.
* `fn_calculate_match_score`: (Optional) Tính % phù hợp skill.

-----
## **4. Mô tả cụ thể API**

### 4.1\. Module Authentication (Xác thực)

#### **Endpoint: /auth/register**

  - **Mô tả:** Đăng ký tài khoản mới. Hệ thống sẽ tạo bản ghi trong bảng `USER` và bảng con tương ứng (`CANDIDATE` hoặc `EMPLOYER`) dựa trên `userType`.
  - **Auth:** Không yêu cầu.
  - **Ràng buộc:**
      - `username`, `email`, `phone` phải là duy nhất.
      - `password` cần được hash trước khi lưu xuống DB.
  - **Request Body:**



```json
POST /api/v1/auth/register
{
    "username": "hoangnguyen",
    "password": "Password123!",
    "email": "hoang@email.com",
    "phone": "0909123456",
    "name": "Nguyễn Văn Hoàng",
    "userType": "Candidate" // Hoặc "Employer"
}
```

  - **Response (Success):**



```json
{
    "message": "Đăng ký thành công. Vui lòng xác thực OTP để kích hoạt tài khoản.",
    "data": {
        "userId": "1001",
        "username": "hoangnguyen",
        "email": "hoang@email.com",
        "isActive": false // Mặc định false theo ràng buộc 1.3 
    },
    "error": null
}
```

#### **Endpoint: /auth/login**

  - **Mô tả:** Đăng nhập hệ thống.
  - **Auth:** Không yêu cầu.
  - **Ràng buộc:** User phải Active (đã xác thực OTP) mới được login.
  - **Request Body:**



```json
POST /api/v1/auth/login
{
    "emailOrPhone": "hoang@email.com",
    "password": "Password123!"
}
```

  - **Response (Success):**



```json
{
    "message": "Đăng nhập thành công",
    "data": {
        "accessToken": "eyJhbGciOiJIUz...",
        "refreshToken": "d78sdf78s...",
        "user": {
            "id": "1001",
            "name": "Nguyễn Văn Hoàng",
            "userType": "Candidate",
            "avatar": "https://api.mysite.com/uploads/avatar-default.jpg"
        }
    },
    "error": null
}
```

#### **Endpoint: /auth/verify-otp**

  - **Mô tả:** Xác thực tài khoản sau khi đăng ký hoặc xác thực hành động nhạy cảm.
  - **Auth:** Có (Bearer Token tạm thời) hoặc Không (tùy luồng).
  - **Ràng buộc:** Kích hoạt trạng thái Active cho User.
  - **Request Body:**



```json
POST /api/v1/auth/verify-otp
{
    "email": "hoang@email.com",
    "otpCode": "123456"
}
```

  - **Response (Success):**



```json
{
    "message": "Xác thực thành công. Tài khoản đã được kích hoạt.",
    "data": true,
    "error": null
}
```

#### **Endpoint: /auth/refresh-token**

  - **Mô tả:** Cấp lại `accessToken` mới khi token cũ hết hạn. Thường áp dụng cơ chế **Refresh Token Rotation** (cấp lại cả `refreshToken` mới để tăng tính bảo mật).
  - **Auth:** Không yêu cầu (vì `accessToken` đã hết hạn), nhưng cần `refreshToken` hợp lệ.
  - **Ràng buộc:**
      * `refreshToken` gửi lên phải tồn tại trong DB (hoặc Redis) và chưa hết hạn.
      * Nếu phát hiện `refreshToken` đã bị thu hồi hoặc sử dụng lại (reuse detection), hệ thống sẽ hủy toàn bộ chuỗi token của user đó
  - **Request Body:**

```json
POST /api/v1/auth/refresh-token
{
  "refreshToken": "d78sdf78s7d8f7s8d7f8sd7f8sd..."
}
```

  * **Response (Success):**
```json
{
  "message": "Cấp lại token thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUz...", // Token mới (hạn ngắn: 15p-1h)
    "refreshToken": "new_refresh_token_xyz..." // Token mới (hạn dài: 7-30 ngày)
  },
  "error": null
}
```

  * **Response (Error - Token không hợp lệ/Hết hạn):**
      * HTTP Status: 401 hoặc 403


```json
{
  "message": "Refresh token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
  "data": null,
  "error": {
    "code": "TOKEN_EXPIRED",
    "details": "Refresh token expired at 2025-11-18"
  }
}
```

#### **Endpoint: /auth/forgot-password**

- **Mô tả:** Yêu cầu gửi mã OTP để đặt lại mật khẩu khi người dùng quên.

- **Auth:** Không yêu cầu.

- **Ràng buộc:**

      * Kiểm tra email có tồn tại trong hệ thống không.
      * Để tránh tấn công dò quét email (User Enumeration), response nên luôn trả về thành công dù email có tồn tại hay không (nhưng thực tế development có thể trả lỗi cụ thể để dễ debug, dưới đây là mẫu chuẩn bảo mật).
      * OTP có thời hạn ngắn (ví dụ: 5 phút).

- **Request Body:**


```json
POST /api/v1/auth/forgot-password
{
  "email": "hoang@email.com"
}
```

  - **Response (Success):**


```json
{
  "message": "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi đến hộp thư của bạn.",
  "data": {
      "email": "hoang@email.com",
      "timeout": 300 // Thời gian hết hạn OTP (giây) để frontend đếm ngược
  },
  "error": null
}
```

#### **Endpoint: /auth/reset-password**

  - **Mô tả:** Thiết lập mật khẩu mới sau khi có OTP hợp lệ.

  - **Auth:** Không yêu cầu.

  - **Ràng buộc:**

      * `otpCode` phải khớp với email và chưa hết hạn.
      * `newPassword` phải tuân thủ policy (độ dài, ký tự đặc biệt...).
      * Sau khi reset thành công, hệ thống nên **thu hồi (revoke)** tất cả các `refreshToken` đang hoạt động của user đó để bắt buộc đăng nhập lại trên mọi thiết bị.

  - **Request Body:**

```json
POST /api/v1/auth/reset-password
{
  "email": "hoang@email.com",
  "otpCode": "123456",
  "newPassword": "NewPassword123!"
}
```

  - **Response (Success):**

```json
{
  "message": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.",
  "data": true, // Hoặc trả về boolean
  "error": null
}
```

  - **Response (Error - Sai OTP):**
      * HTTP Status: 400 Bad Request

```json
{
  "message": "Mã OTP không chính xác hoặc đã hết hạn.",
  "data": null,
  "error": {
    "code": "INVALID_OTP",
    "details": "OTP mismatch"
  }
}
```

-----

### 4.2\. Module Users (Người dùng chung)

#### **Endpoint: /users/me**

  - **Mô tả:** Lấy thông tin chi tiết của user đang đăng nhập (bao gồm cả thông tin bảng `PERSON` hoặc `COMPANY` nếu đã link).
  - **Auth:** Required (`Bearer Token`).
  - **Ràng buộc:** Không.
  - **Request Body:** `null`
  - **Response (Success):**



```json
GET /api/v1/users/me
{
    "message": "Lấy thông tin thành công",
    "data": {
        "id": "1001",
        "username": "hoangnguyen",
        "email": "hoang@email.com",
        "phone": "0909123456",
        "name": "Nguyễn Văn Hoàng",
        "address": "TP.HCM",
        "userType": "Candidate",
        "ssn": "079123456789", // Nếu là Person
        "dob": "2000-01-01"
    },
    "error": null
}
```

#### **Endpoint: /users/me**

  - **Mô tả:** Cập nhật thông tin cá nhân.
  - **Auth:** Required.
  - **Ràng buộc:**
      - Nếu là `Candidate`, `DOB` (Ngày sinh) phải đảm bảo tuổi \>= 18 (Tính toán: CurrentDate - DOB \>= 18 years).
  - **Request Body:**



```json
PUT /api/v1/users/me
{
    "name": "Nguyễn Văn Hoàng",
    "address": "Hà Nội",
    "dob": "2000-05-20", // Backend check age > 18
    "ssn": "079098765432"
}
```

  - **Response (Success):**



```json
{
    "message": "Cập nhật thông tin thành công",
    "data": {
        "id": "1001",
        "name": "Nguyễn Văn Hoàng",
        "dob": "2000-05-20"
    },
    "error": null
}
```

-----

### 4.3\. Module Candidate (Ứng viên)

#### **Endpoint: /candidates/:id**
  - **Mô tả:** Xem profile công khai của một ứng viên cụ thể (Dành cho Nhà tuyển dụng xem chi tiết trước khi liên hệ/phỏng vấn). Kết quả trả về bao gồm thông tin cá nhân, kỹ năng và lịch sử làm việc.
  - **Auth:** Required (Role: Employer).
  - **Ràng buộc:** `id` ứng viên phải tồn tại và tài khoản đó phải đang Active.
  - **Request Body:** `null`

```json
GET /api/v1/candidates/:id
GET /api/v1/candidates/1001
```
  - **Response (Success):**

```json
{
    "message": "Lấy thông tin ứng viên thành công",
    "data": {
        "id": "1001",
        "name": "Nguyễn Văn Hoàng",
        "email": "hoang@email.com",
        "phone": "0909123456",
        "address": "TP.HCM",
        "cvUrl": "https://storage.mysite.com/cvs/hoangnv_2025.pdf",
        "skills": ["Java", "Spring Boot", "SQL"],
        "jobHistory": [
            {
                "comName": "FPT Software",
                "position": "Junior Developer",
                "duration": "1 year"
            }
        ]
    },
    "error": null
}
```

#### **Endpoint: /candidates/me/cv**

- **Mô tả:** Upload hoặc cập nhật đường dẫn CV mặc định cho hồ sơ ứng viên (Lưu trong bảng `CANDIDATE`).
- **Auth:** Required (Role: Candidate).
- **Ràng buộc:** `cvUrl` phải là đường dẫn hợp lệ (nếu hệ thống tách riêng API upload file) hoặc file PDF/DOCX không quá 5MB (nếu upload trực tiếp). Dưới đây mô phỏng trường hợp cập nhật URL sau khi upload file.
- **Request Body:**

```json
PUT /api/v1/candidates/me/cv
{
    "cvUrl": "https://storage.mysite.com/uploads/my-new-cv-2025.pdf",
    "cvName": "CV_Fullstack_Senior.pdf" // Tên hiển thị (Optional)
}
```
  - **Response (Success):**

```json
{
    "message": "Cập nhật CV thành công",
    "data": {
        "candidateId": "1001",
        "cvUrl": "https://storage.mysite.com/uploads/my-new-cv-2025.pdf",
        "updatedAt": "2025-11-19T16:00:00Z"
    },
    "error": null
}
```

#### **Endpoint: /candidates/me/job-history**

  - **Mô tả:** Thêm mới lịch sử làm việc vào bảng `JOB_HISTORY`.
  - **Auth:** Required (Role: Candidate).
  - **Ràng buộc:** `EndTime` phải \>= `StartTime` (nếu đã kết thúc).
  - **Request Body:**



```json
POST /api/v1/candidates/me/job-history
{
    "comName": "FPT Software",
    "position": "Junior Developer",
    "startTime": "2023-01-01",
    "endTime": "2024-01-01",
    "duration": "1 year"
}
```

  - **Response (Success):**



```json
{
    "message": "Thêm lịch sử làm việc thành công",
    "data": {
        "historyId": "55",
        "comName": "FPT Software"
    },
    "error": null
}
```

#### **Endpoint: /candidates/me/job-history**

  - **Mô tả:** Lây lịch sử làm việc từ bảng `JOB_HISTORY`.
  - **Auth:** Required (Role: Candidate).
  - **Ràng buộc:** `EndTime` phải \>= `StartTime` (nếu đã kết thúc).

```json
GET /api/v1/candidates/me/job-history
```

  - **Response (Success):**


```json
{
    "message": "Thêm lịch sử làm việc thành công",
    "data": {
        "historyId": "55",
        "comName": "FPT Software"
    },
    "error": null
}
```


#### **Endpoint: /candidates/me/skills**

  - **Mô tả:** Cập nhật danh sách kỹ năng (Bảng `OWN`).
  - **Auth:** Required (Role: Candidate).
  - **Ràng buộc:** Ứng viên phải có ít nhất 1 skill.
  - **Request Body:**



```json
PUT /api/v1/candidates/me/skills
{
    "skillIds": [1, 5, 10] // Mảng các ID skill đã có trong hệ thống
}
```

  - **Response (Success):**


```json
{
    "message": "Cập nhật kỹ năng thành công",
    "data": ["Java", "Spring Boot", "SQL"],
    "error": null
}
```

-----

### 4.4\. Module Employer & Company (Nhà tuyển dụng)

#### **Endpoint: /companies**

  - **Mô tả:** Tạo/Liên kết profile công ty cho Employer.
  - **Auth:** Required (Role: Employer).
  - **Ràng buộc:** `TaxNumber`, `Website` phải đúng định dạng hợp lệ. Đây là điều kiện tiên quyết để được đăng Job.
  - **Request Body:**


```json
POST /api/v1/companies
{
    "taxNumber": "0101234567",
    "name": "Tech Solutions Inc.",
    "foundedDate": "2010-10-10",
    "industry": "Software Outsourcing",
    "size": "100-500",
    "country": "Vietnam",
    "website": "https://techsolutions.com"
}
```

  - **Response (Success):**


```json
{
    "message": "Tạo profile công ty thành công",
    "data": {
        "companyId": "202",
        "name": "Tech Solutions Inc."
    },
    "error": null
}
```

#### **Endpoint: /employers/me**
  - **Mô tả:** Cập nhật thông tin hồ sơ nhà tuyển dụng. Endpoint này xử lý cập nhật đồng thời thông tin cá nhân (bảng `PERSON`) và thông tin công ty (bảng `COMPANY`) nếu Employer đó là đại diện quản lý của công ty.
  - **Auth:** Required (Role: Employer).
  - **Ràng buộc:**
    - `companyInfo` chỉ được cập nhật nếu Employer đã liên kết với một công ty.
    - Các trường như `email` thường không cho phép đổi tại đây (phải qua quy trình riêng).
  - **Request Body:**

```json
PUT /api/v1/employers/me
{
    "name": "Trần Văn Tuyển Dụng", // Update bảng Person
    "phone": "0912345678",
    "address": "Tầng 5, Tòa nhà ABC, Hà Nội",
    "companyInfo": { // Optional: Chỉ update nếu đã có companyId
        "name": "Tech Solutions Inc.",
        "website": "https://new-domain.com",
        "size": "500-1000"
    }
}
```

  - **Response (Success):**

```json
{
    "message": "Cập nhật hồ sơ nhà tuyển dụng thành công",
    "data": {
        "employerId": "2002",
        "name": "Trần Văn Tuyển Dụng",
        "company": {
            "id": "202",
            "name": "Tech Solutions Inc.",
            "website": "https://new-domain.com"
        }
    },
    "error": null
}
```

#### **Endpoint: /employers/:id**

  - **Mô tả:** Lấy thông tin chi tiết công khai của một nhà tuyển dụng (hoặc công ty). Dùng để hiển thị trang chi tiết công ty/nhà tuyển dụng cho ứng viên xem.
  - **Auth:** Không yêu cầu (Public) hoặc Required (tùy cấu hình bảo mật).
  - **Ràng buộc:** `id` phải tồn tại.
  - **Request Body:** `null`

```json
GET /api/v1/employers/2002
```

  - **Response (Success):**

```json
{
    "message": "Lấy thông tin nhà tuyển dụng thành công",
    "data": {
        "id": "2002",
        "name": "Trần Văn Tuyển Dụng",
        "avatar": "https://.../avatar.jpg",
        "company": {
            "id": "202",
            "name": "Tech Solutions Inc.",
            "industry": "Software Outsourcing",
            "address": "Hà Nội"
        },
        "activeJobs": 5 // Số lượng job đang tuyển
    },
    "error": null
}
```

#### **Endpoint: /employers/:id/followers**

  - **Mô tả:** Xem danh sách các ứng viên (Candidates) đang theo dõi (Follow) nhà tuyển dụng này. Dữ liệu lấy từ bảng `FOLLOW`.
  - **Auth:** Required (Role: Employer).
  - **Ràng buộc:** Employer chỉ được xem danh sách follow của chính mình (Check `me.id == :id`).
  - **Request Body:** `null`

```json
GET /api/v1/employers/2002/followers
```

  - **Response (Success):**

```json
{
    "message": "Lấy danh sách người theo dõi thành công",
    "data": [
        {
            "userId": "1001",
            "name": "Nguyễn Văn Hoàng",
            "avatar": "https://.../u1.jpg",
            "headline": "Java Developer"
        },
        {
            "userId": "1005",
            "name": "Lê Thị B",
            "avatar": "default.jpg",
            "headline": "Fresher Tester"
        }
    ],
    "error": null
}
```

-----

### 4.5\. Module Jobs (Việc làm)

Dựa trên danh sách yêu cầu của bạn và template mẫu, dưới đây là mô tả chi tiết cho các API thuộc module **Jobs**.

*Lưu ý: Các endpoint dưới đây được viết chính xác theo đường dẫn bạn cung cấp trong yêu cầu (`/post`, `/update`, `/delete`).*

#### **Endpoint: /jobs**

  - **Mô tả:** Tìm kiếm việc làm theo nhiều tiêu chí kết hợp. Hệ thống sẽ query trên các bảng liên kết (`JOB`, `JOB_DESCRIPTION`, `REQUIRE`, `IN`).
  - **Auth:** Không yêu cầu (Public).
  - **Ràng buộc:** Trả về danh sách job đang active (chưa hết hạn, chưa bị ẩn).
  - **Request Body:** `null` (Sử dụng Query Parameters).
    - URL mẫu: `/api/v1/jobs?q=Java&loc=HoChiMinh&salary_min=1000&skill=Spring&cat=Backend`
  - **Response (Success):**

```json
{
    "message": "Tìm thấy 15 kết quả phù hợp",
    "data": [
        {
            "jobId": "888",
            "title": "Senior Backend Developer",
            "companyName": "Tech Solutions Inc.",
            "logoUrl": "https://.../logo.png",
            "salary": "2000-3000 USD",
            "location": "Ho Chi Minh",
            "skills": ["Java", "Spring"],
            "postDate": "2025-11-19"
        },
        {
            "jobId": "889",
            "title": "Java Lead",
            "companyName": "FPT Software",
            "logoUrl": "https://.../fpt.png",
            "salary": "Thỏa thuận",
            "location": "Ha Noi",
            "skills": ["Java", "Microservices"],
            "postDate": "2025-11-18"
        }
    ],
    "error": null
}
```

#### **Endpoint: /jobs/:id**

  - **Mô tả:** Xem thông tin chi tiết của một việc làm. Bao gồm thông tin chung, mô tả chi tiết (JD), yêu cầu kỹ năng và thông tin sơ lược về công ty tuyển dụng.
  - **Auth:** Không yêu cầu.
  - **Ràng buộc:** `id` phải tồn tại.
  - **Request Body:** `null`
  - **Response (Success):**

```json
{
    "message": "Lấy chi tiết việc làm thành công",
    "data": {
        "jobInfo": {
            "id": "888",
            "title": "Senior Backend Developer",
            "expireDate": "2025-12-31",
            "viewCount": 150
        },
        "company": {
            "id": "202",
            "name": "Tech Solutions Inc.",
            "avatar": "https://.../logo.png"
        },
        "jd": {
            "description": "Thiết kế và phát triển hệ thống...",
            "requirements": "Có 3 năm kinh nghiệm Java...",
            "benefits": "Lương tháng 13, Laptop Macbook...",
            "location": "Quận 1, TP.HCM",
            "jobType": "Full-time"
        },
        "skills": ["Java", "Spring Boot", "PostgreSQL"],
        "categories": ["Backend", "IT Software"]
    },
    "error": null
}
```

#### **Endpoint: /jobs/post**

  - **Mô tả:** Đăng tin tuyển dụng mới (Employer). Backend insert dữ liệu vào các bảng liên quan.
  - **Auth:** Required (Role: Employer).
  - **Ràng buộc:**
    - Employer phải hoàn tất hồ sơ công ty (Tax, Address...) mới được đăng.
    - Payload bắt buộc phải có Skills và Categories.
  - **Request Body:**

```json
POST /api/v1/jobs/post
{
    "jobInfo": {
        "title": "Senior Backend Developer",
        "expireDate": "2025-12-31"
    },
    "jdInfo": {
        "location": "Ho Chi Minh",
        "salary": "2000-3000 USD",
        "quantity": 5,
        "expYear": 3,
        "level": "Senior",
        "contractType": "Fulltime",
        "jobType": "Hybrid",
        "description": "Mô tả công việc chi tiết..."
    },
    "skillIds": [1, 2],
    "categoryIds": [5]
}
```

  - **Response (Success):**

```json
{
    "message": "Đăng tin tuyển dụng thành công",
    "data": {
        "jobId": "888",
        "title": "Senior Backend Developer",
        "postDate": "2025-11-19"
    },
    "error": null
}
```

#### **Endpoint: /jobs/update/:id**

  - **Mô tả:** Cập nhật nội dung tin tuyển dụng đã đăng.
  - **Auth:** Required (Role: Employer - Owner).
  - **Ràng buộc:** Chỉ người tạo job (hoặc Admin) mới được quyền sửa.
  - **Request Body:**

```json
PUT /api/v1/jobs/update/888
{
    "jobInfo": {
        "title": "Lead Backend Developer", // Đổi title
        "expireDate": "2026-01-30" // Gia hạn
    },
    "jdInfo": {
        "salary": "Up to 4000 USD"
    }
    // Các trường không gửi sẽ giữ nguyên
}
```

  - **Response (Success):**

```json
{
    "message": "Cập nhật tin tuyển dụng thành công",
    "data": {
        "jobId": "888",
        "updatedAt": "2025-11-20T10:00:00Z"
    },
    "error": null
}
```

#### **Endpoint: /jobs/delete/:id**

  - **Mô tả:** Đóng hoặc xóa mềm (Soft Delete) tin tuyển dụng.
  - **Auth:** Required (Role: Employer - Owner).
  - **Ràng buộc:** Không thể xóa nếu job vẫn còn hồ sơ ứng tuyển (`APPLY`) đang ở trạng thái chờ xử lý (chưa `Accepted` hoặc `Rejected`).
  - **Request Body:** `null`

```json
DELETE /api/v1/jobs/delete/888
```

  - **Response (Success):**

```json
{
    "message": "Đã đóng tin tuyển dụng thành công",
    "data": true,
    "error": null
}
```

#### **Endpoint: /jobs/:id/relate**

  - **Mô tả:** Gắn một job khác làm "Job liên quan" (Manual Relation) để hiển thị gợi ý cho ứng viên. Thao tác trên bảng `RELATE` (hoặc tương tự).
  - **Auth:** Required (Role: Employer).
  - **Ràng buộc:** Job được gắn phải thuộc cùng công ty và đang active.
  - **Request Body:**

```json
POST /api/v1/jobs/888/relate
{
    "relatedJobId": "889" // ID của job muốn gắn liên kết
}
```

  - **Response (Success):**

```json
{
    "message": "Gắn job liên quan thành công",
    "data": {
        "sourceJobId": "888",
        "relatedJobId": "889"
    },
    "error": null
}
```

-----

### 4.6\. Module Application (Ứng tuyển)

#### **Endpoint: /jobs/:id/apply**

  - **Mô tả:** Ứng viên nộp đơn ứng tuyển vào một công việc cụ thể. Hệ thống sẽ tạo bản ghi trong bảng `APPLY`.
  - **Auth:** Required (Role: Candidate).
  - **Ràng buộc:**
    - **Duplicate Check:** Kiểm tra xem user đã apply vào job này chưa.
    - **Expiration Check:** Job phải còn hạn (`ExpireDate` \> CurrentDate).
    - **CV Logic:** Nếu `cvUrl` không được gửi lên, hệ thống sẽ tự động lấy CV mặc định trong profile Candidate. Nếu không có cả 2 -\> Báo lỗi.
  - **Request Body:**

```json
POST /api/v1/jobs/888/apply
{
    "coverLetter": "Tôi có 3 năm kinh nghiệm và rất mong muốn được làm việc...",
    "cvUrl": "https://storage.mysite.com/uploads/custom-cv-for-job-888.pdf" // Optional
}
```

  - **Response (Success):**

```json
{
    "message": "Nộp hồ sơ ứng tuyển thành công",
    "data": {
        "applyId": "9001",
        "jobId": "888",
        "status": "Applied",
        "appliedAt": "2025-11-19T10:30:00Z"
    },
    "error": null
}
```

#### **Endpoint: /candidates/me/applies**

  - **Mô tả:** Xem lịch sử các công việc mà ứng viên hiện tại đã ứng tuyển.
  - **Auth:** Required (Role: Candidate).
  - **Ràng buộc:** Lấy danh sách dựa trên ID của user đang đăng nhập.
  - **Request Body:** `null`

```json
GET /api/v1/candidates/me/applies
```

  - **Response (Success):**

```json
{
    "message": "Lấy lịch sử ứng tuyển thành công",
    "data": [
        {
            "applyId": "9001",
            "jobId": "888",
            "jobTitle": "Senior Backend Developer",
            "companyName": "Tech Solutions Inc.",
            "status": "Applied",
            "date": "2025-11-19"
        },
        {
            "applyId": "8050",
            "jobId": "777",
            "jobTitle": "Java Fresher",
            "companyName": "FPT Software",
            "status": "Rejected",
            "date": "2025-10-15"
        }
    ],
    "error": null
}
```

#### **Endpoint: /jobs/:id/applies**

  - **Mô tả:** Employer xem danh sách các ứng viên đã nộp đơn vào một job cụ thể của mình.
  - **Auth:** Required (Role: Employer - Owner).
  - **Ràng buộc:** Employer chỉ được xem danh sách ứng viên của Job do chính mình (hoặc công ty mình) tạo.
  - **Request Body:** `null`

```json
GET /api/v1/jobs/888/applies
```

  - **Response (Success):**

```json
{
    "message": "Lấy danh sách ứng viên thành công",
    "data": [
        {
            "applyId": "9001",
            "candidateId": "1001",
            "name": "Nguyễn Văn Hoàng",
            "email": "hoang@email.com",
            "cvUrl": "https://storage.mysite.com/cvs/hoang_cv.pdf",
            "coverLetter": "Tôi có 3 năm kinh nghiệm...",
            "status": "Applied",
            "appliedAt": "2025-11-19"
        }
    ],
    "error": null
}
```

#### **Endpoint: /applies/:id/status**

  - **Mô tả:** Cập nhật trạng thái hồ sơ ứng tuyển (Quy trình tuyển dụng).
  - **Auth:** Required (Role: Employer - Owner).
  - **Ràng buộc:** `status` phải thuộc tập hợp: `["Applied", "Shortlisted", "Interviewed", "Accepted", "Rejected"]`.
  - **Request Body:**

```json
PUT /api/v1/applies/9001/status
{
    "status": "Interviewed"
}
```

  - **Response (Success):**

```json
{
    "message": "Cập nhật trạng thái hồ sơ thành công",
    "data": {
        "applyId": "9001",
        "status": "Interviewed",
        "updatedAt": "2025-11-25T09:00:00Z"
    },
    "error": null
}
```

#### **Endpoint: /applies/:id**

  - **Mô tả:** Ứng viên rút hồ sơ (Xóa bản ghi ứng tuyển).
  - **Auth:** Required (Role: Candidate - Owner).
  - **Ràng buộc:**
    - Chỉ được rút hồ sơ khi Job **chưa hết hạn**.
    - (Tùy chọn thêm: Không được rút nếu Employer đã chuyển trạng thái sang `Accepted` hoặc `Rejected`).
  - **Request Body:** `null`

```json
DELETE /api/v1/applies/9001
```

  - **Response (Success):**

```json
{
    "message": "Đã rút hồ sơ thành công",
    "data": [],
    "error": null
}
```

-----

### 4.7\. Module Interaction (Tương tác)

#### **Endpoint: /employers/:id/follow**

  - **Mô tả:** Thực hiện hành động Follow (Theo dõi) hoặc Unfollow (Bỏ theo dõi) một nhà tuyển dụng. Cơ chế Toggle: Nếu chưa follow thì -\> follow, nếu đang follow thì -\> unfollow.
  - **Auth:** Required (Role: Candidate).
  - **Ràng buộc:** Không thể tự follow chính mình (nếu logic cho phép User follow User).
  - **Request Body:** `null` (Hành động được xác định qua Endpoint và trạng thái hiện tại trong DB).
  - **Response (Success - Follow):**

```json
{
    "message": "Đã theo dõi nhà tuyển dụng thành công",
    "data": {
        "employerId": "2002",
        "isFollowing": true
    },
    "error": null
}
```

*(Hoặc message: "Đã hủy theo dõi" và `isFollowing: false` nếu là Unfollow)*

#### **Endpoint: /jobs/:id/feedback**

  - **Mô tả:** Ứng viên gửi đánh giá về công việc sau khi hoàn thành quy trình tuyển dụng. Dữ liệu lưu vào bảng `FEEDBACK`.
  - **Auth:** Required (Role: Candidate).
  - **Ràng buộc:**
    - Chỉ cho phép gửi đánh giá khi `status` trong bảng `APPLY` của ứng viên đối với job này là `Accepted` hoặc `Finished`.
    - Mỗi user chỉ được đánh giá 1 lần cho 1 job.
  - **Request Body:**

```json
POST /api/v1/jobs/888/feedback
{
    "content": "Quy trình phỏng vấn nhanh gọn, HR thân thiện.",
    "rank": 5 // Giá trị từ 1 đến 5
}
```

  - **Response (Success):**

```json
{
    "message": "Gửi đánh giá thành công",
    "data": {
        "feedbackId": "12",
        "jobId": "888",
        "rank": 5,
        "createdAt": "2025-11-19T12:00:00Z"
    },
    "error": null
}
```

#### **Endpoint: /messages**

  - **Mô tả:** Lấy lịch sử tin nhắn giữa người dùng hiện tại và một người dùng khác.
  - **Auth:** Required.
  - **Ràng buộc:** Phải truyền tham số `with_user_id` để xác định đối phương. Sắp xếp theo thời gian gửi tăng dần (cũ nhất -\> mới nhất).
  - **Request Body:** `null` (Sử dụng Query Params).
    - URL: `/api/v1/messages?with_user_id=2002&limit=20&offset=0`
  - **Response (Success):**

```json
{
    "message": "Lấy lịch sử tin nhắn thành công",
    "data": [
        {
            "messageId": "550",
            "senderId": "2002", // Employer
            "content": "Chào bạn, bên mình đã nhận được CV.",
            "createdAt": "2025-11-18T09:00:00Z"
        },
        {
            "messageId": "551",
            "senderId": "1001", // Me (Candidate)
            "content": "Dạ vâng, cảm ơn anh/chị.",
            "createdAt": "2025-11-18T09:05:00Z"
        }
    ],
    "error": null
}
```

#### **Endpoint: /messages**

  - **Mô tả:** Gửi tin nhắn mới cho một người dùng khác. Hệ thống tạo record trong `MESSAGE` và `SENDMSG`.
  - **Auth:** Required.
  - **Ràng buộc:**
    - `receiverId` phải tồn tại trong hệ thống.
    - `content` không được để trống.
  - **Request Body:**

```json
POST /api/v1/messages
{
    "receiverId": "2002",
    "content": "Cho mình hỏi thời gian phỏng vấn cụ thể ạ?"
}
```

  - **Response (Success):**

```json
{
    "message": "Gửi tin nhắn thành công",
    "data": {
        "messageId": "555",
        "receiverId": "2002",
        "sendTime": "2025-11-19T14:00:00Z",
        "status": "Sent"
    },
    "error": null
}
```

#### **Endpoint: /notifications**

  - **Mô tả:** Lấy danh sách thông báo của người dùng hiện tại.
  - **Auth:** Required.
  - **Ràng buộc:** Có thể filter theo trạng thái (đã đọc/chưa đọc) nếu cần thiết kế mở rộng. Mặc định lấy tất cả, sắp xếp mới nhất lên đầu.
  - **Request Body:** `null`
  - **Response (Success):**

```json
{
    "message": "Lấy danh sách thông báo thành công",
    "data": [
        {
            "id": "99",
            "title": "Hồ sơ được duyệt",
            "content": "Nhà tuyển dụng Tech Solutions đã xem hồ sơ của bạn.",
            "type": "ApplyStatus",
            "isRead": false,
            "createdAt": "2025-11-19T08:00:00Z"
        },
        {
            "id": "98",
            "title": "Tin nhắn mới",
            "content": "Bạn có tin nhắn mới từ HR FPT.",
            "type": "Message",
            "isRead": true,
            "createdAt": "2025-11-18T10:00:00Z"
        }
    ],
    "error": null
}
```

#### **Endpoint: /notifications/:id/read**

  - **Mô tả:** Đánh dấu một thông báo cụ thể là "Đã đọc".
  - **Auth:** Required (Owner).
  - **Ràng buộc:** User chỉ được đánh dấu thông báo của chính mình.
  - **Request Body:** `null` (Hoặc object rỗng `{}`).

```json
PUT /api/v1/notifications/99/read
```

  - **Response (Success):**

```json
{
    "message": "Đã đánh dấu đã đọc",
    "data": {
        "notificationId": "99",
        "isRead": true
    },
    "error": null
}
```

### 4.8\. Module Metadata (Dữ liệu danh mục)
#### **Endpoint: /skills**

  - **Mô tả:** Lấy danh sách các kỹ năng chuyên môn có trong hệ thống (Bảng `SKILL`). Dùng để hiển thị dropdown hoặc auto-complete khi User nhập profile hoặc Employer đăng tin.
  - **Auth:** Không yêu cầu (Public).
  - **Ràng buộc:** Có thể hỗ trợ tìm kiếm theo tên nếu danh sách quá dài (VD: `?q=Java`).
  - **Request Body:** `null`

```json
GET /api/v1/skills
```

  - **Response (Success):**

```json
{
    "message": "Lấy danh sách kỹ năng thành công",
    "data": [
        {
            "id": 1,
            "name": "Java"
        },
        {
            "id": 2,
            "name": "Spring Boot"
        },
        {
            "id": 3,
            "name": "ReactJS"
        }
    ],
    "error": null
}
```

#### **Endpoint: /categories**

  - **Mô tả:** Lấy danh sách các nhóm ngành nghề/lĩnh vực việc làm (Bảng `JOB_CATEGORY`).
  - **Auth:** Không yêu cầu (Public).
  - **Ràng buộc:** Không.
  - **Request Body:** `null`

```json
GET /api/v1/categories
```

  - **Response (Success):**

```json
{
    "message": "Lấy danh sách ngành nghề thành công",
    "data": [
        {
            "id": 1,
            "name": "IT - Phần mềm"
        },
        {
            "id": 2,
            "name": "Marketing / Truyền thông"
        },
        {
            "id": 3,
            "name": "Hành chính nhân sự"
        }
    ],
    "error": null
}
```