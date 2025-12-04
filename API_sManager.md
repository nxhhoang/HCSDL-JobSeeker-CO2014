### 2.9 Module Admin (Dành cho sManager)

  * **Quy ước URL:** `/api/v1/admin/...`
  * **Authentication:** Bắt buộc. Header `Authorization: Bearer <token>`.
  * **Authorization:** Chỉ User có Role là `Admin` (hoặc cờ `isAdmin=true`) mới được truy cập. Middleware sẽ chặn tất cả các role khác (Candidate/Employer).

#### Bảng tóm tắt các Endpoints

| Method | Endpoint | Mô tả & Logic nghiệp vụ |
| :--- | :--- | :--- |
| **QUẢN LÝ NGƯỜI DÙNG (USER & COMPANY)** |
| `GET` | `/admin/users` | Lấy danh sách tất cả người dùng (phân trang).<br>Params: `?role=Employer&active=false` (Lọc user chưa active). |
| `PUT` | `/admin/users/:id/status` | Khóa (Ban) hoặc Mở khóa (Unban) tài khoản.<br>Logic: Nếu Ban, set `isActive=false` và hủy token hiện tại. |
| `PUT` | `/admin/companies/:id/verify` | Duyệt thông tin doanh nghiệp (dựa trên Mã số thuế/Giấy phép).<br>Logic: Cập nhật trạng thái verified cho Employer. |
| **QUẢN LÝ NỘI DUNG (JOBS)** |
| `DELETE` | `/admin/jobs/:id` | Xóa tin tuyển dụng vi phạm (Spam, lừa đảo).<br>Logic: Xóa bất chấp trạng thái (Admin Override). |
| **QUẢN LÝ DANH MỤC (METADATA - CRUD)** |
| `POST` | `/admin/skills` | Thêm kỹ năng mới vào hệ thống (Bảng `SKILL`). |
| `PUT` | `/admin/skills/:id` | Chỉnh sửa tên kỹ năng (nếu bị sai chính tả). |
| `DELETE` | `/admin/skills/:id` | Xóa kỹ năng (Kiểm tra ràng buộc khóa ngoại với bảng `OWN/REQUIRE`). |
| `POST` | `/admin/categories` | Thêm danh mục ngành nghề mới (Bảng `JOB_CATEGORY`). |
| `PUT` | `/admin/categories/:id` | Sửa tên danh mục. |
| **THỐNG KÊ & BÁO CÁO (Dùng cho yêu cầu gọi Stored Procedure)** |
| `GET` | `/admin/dashboard/stats` | Lấy số liệu tổng quan (Số user mới, số job active, số hồ sơ đã nộp).<br>**Lưu ý:** API này sẽ gọi xuống Stored Procedure trong DB. |

-----

### 4\. Chi tiết Mô tả API (Admin)

#### 4.9.1. Quản lý danh mục (Metadata)

Đây là chức năng cơ bản nhất để `sManager` vận hành hệ thống, đáp ứng yêu cầu CRUD trên 1 bảng đơn giản.

**Endpoint:** `/admin/skills`

  * **Method:** `POST`
  * **Mô tả:** Thêm kỹ năng mới (Ví dụ: "Rust", "Golang" khi thị trường xuất hiện công nghệ mới).
  * **Request Body:**
    ```json
    {
      "skillName": "Rust Lang",
      "description": "Ngôn ngữ lập trình hệ thống an toàn"
    }
    ```
  * **Response (Success):**
    ```json
    {
      "message": "Thêm kỹ năng thành công",
      "data": {
        "id": 105,
        "skillName": "Rust Lang"
      }
    }
    ```

#### 4.9.2. Quản lý Người dùng (User Management)

Đáp ứng yêu cầu nghiệp vụ: Kiểm soát tài khoản rác hoặc duyệt doanh nghiệp.

**Endpoint:** `/admin/users/:id/status`

  * **Method:** `PUT`
  * **Mô tả:** Thay đổi trạng thái hoạt động của User (Khóa/Mở khóa).
  * **Request Body:**
    ```json
    {
      "isActive": false,
      "reason": "Phát hiện spam tin tuyển dụng lừa đảo"
    }
    ```
  * **Response:** Trả về thông tin User sau khi cập nhật.

#### 4.9.3. Thống kê hệ thống (Dashboard)

Đáp ứng yêu cầu **"Call Function/Procedure"** trong phần 3 của đề bài (Part 3 - 6.3 Implement Features).

**Endpoint:** `/admin/dashboard/stats`

  * **Method:** `GET`
  * **Mô tả:** API này sẽ gọi một **Stored Procedure** (ví dụ: `sp_GetSystemStats`) để lấy dữ liệu tổng hợp từ nhiều bảng (`USER`, `JOB`, `APPLY`).
  * **Logic Backend:**
    1.  Nhận Request từ Client.
    2.  Kết nối DB, thực thi `CALL sp_GetSystemStats();`.
    3.  Trả về kết quả JSON.
  * **Response (Success):**
    ```json
    {
      "message": "Lấy dữ liệu thống kê thành công",
      "data": {
        "totalCandidates": 1500,
        "totalEmployers": 120,
        "activeJobs": 450,
        "totalAppliesThisMonth": 300,
        "revenue": 0 // (Nếu có tính năng thu phí)
      },
      "error": null
    }
    ```

### 5\. Lưu ý khi hiện thực cho nhóm

1.  **Về User `sManager`:** Cần insert sẵn một dòng vào bảng `USER` với `userType = 'sManager'` để có tài khoản đăng nhập demo.
2.  **Về Code Backend:** middleware đơn giản cho Admin:
    ```javascript
    const verifyAdmin = (req, res, next) => {
        if (req.user.role !== 'sManager') {
            return res.status(403).json({ message: "Access Denied" });
        }
        next();
    };
    ```
3.  **Về UI (Phần 3):** Chỉ cần làm 1 trang Dashboard đơn giản cho `sManager` gồm:
      * Mấy cái thẻ hiển thị số liệu (gọi API Stats).
      * Một bảng danh sách User có nút "Ban/Active".
      * Một form nhỏ để thêm Skill/Category.

Như vậy là đủ để đạt điểm tối đa cho phần phân quyền và chức năng của `sManager`.