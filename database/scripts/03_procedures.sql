USE JobRecruitmentDB;
GO

-- lọc và tìm job
CREATE OR ALTER PROCEDURE sp_FilterJobs
    @Keyword NVARCHAR(100) = NULL,
    @Location NVARCHAR(100) = NULL,
    @MinSalary DECIMAL(18,2) = NULL,
    @ListSkills NVARCHAR(MAX) = NULL -- Ví dụ: 'Java,React,Python'
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT
        J.JobID,
        J.JobName,
        C.Industry,
        U.Name AS CompanyName,
        J.Salary,
        J.[Location],
        J.PostDate,
        (SELECT COUNT(*) FROM [dbo].[APPLY] WHERE JobID = J.JobID) AS ApplicantCount
    FROM [dbo].[JOB] J
    JOIN [dbo].[USER] U ON J.ID = U.ID
    JOIN [dbo].[COMPANY] C ON U.ID = C.ID
    WHERE 
        J.ExpireDate > GETDATE()
        AND (@Keyword IS NULL OR J.JobName LIKE '%' + @Keyword + '%')
        AND (@Location IS NULL OR J.[Location] LIKE '%' + @Location + '%')
        AND (@MinSalary IS NULL OR J.Salary >= @MinSalary)
        
        -- XỬ LÝ MẢNG SKILL TẠI ĐÂY
        AND (@ListSkills IS NULL OR EXISTS (
            SELECT 1 
            FROM [dbo].[REQUIRE] R
            JOIN [dbo].[SKILL] S ON R.SkillID = S.SkillID
            -- Join bảng Skill với danh sách skill user truyền vào (đã tách ra)
            JOIN STRING_SPLIT(@ListSkills, ',') AS UserReq 
            -- Dùng LTRIM/RTRIM để xóa khoảng trắng thừa nếu có (vd: 'Java, Python')
            ON S.SkillName LIKE '%' + LTRIM(RTRIM(UserReq.value)) + '%'
            WHERE R.JobID = J.JobID
        ))
    ORDER BY J.PostDate DESC;
END;
GO



CREATE OR ALTER PROCEDURE sp_GetTopIndustries_Stats
    @TopN INT = 5,                     -- Lấy top 5, top 10...
    @SortCriteria NVARCHAR(20) = 'QUANTITY', -- 'QUANTITY' (Số lượng) hoặc 'SALARY' (Lương)
    @MinJobCount INT = 1               -- Chỉ thống kê ngành có ít nhất N job (trong HAVING)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. INPUT PARAMETER VALIDATION & CONTROL FLOW
    -- Nếu người dùng nhập số âm hoặc 0, tự động lấy Top 5
    IF @TopN <= 0 
    BEGIN
        PRINT N'Warning: @TopN không hợp lệ. Hệ thống tự động đặt lại là 5.';
        SET @TopN = 5;
    END

    -- Chuẩn hóa input: Chuyển về chữ hoa để so sánh cho dễ
    SET @SortCriteria = UPPER(@SortCriteria);

    -- Nếu nhập sai từ khóa sắp xếp, mặc định về QUANTITY
    IF @SortCriteria NOT IN ('QUANTITY', 'SALARY')
    BEGIN
        PRINT N'Warning: Tiêu chí sắp xếp không hợp lệ (chỉ chấp nhận QUANTITY/SALARY). Mặc định: QUANTITY.';
        SET @SortCriteria = 'QUANTITY';
    END

    -- 2. QUERY CHÍNH
    SELECT TOP (@TopN)
        C.Industry,
        COUNT(J.JobID) AS TotalJobs,              -- Aggregate: Đếm số lượng
        AVG(J.Salary) AS AverageSalary,           -- Aggregate: Tính lương trung bình
        MAX(J.Salary) AS HighestSalary,           -- Aggregate: Lương cao nhất trong ngành
        MIN(J.Salary) AS LowestSalary
    FROM [dbo].[JOB] J
    JOIN [dbo].[USER] U ON J.ID = U.ID
    JOIN [dbo].[COMPANY] C ON U.ID = C.ID         -- JOIN 3 bảng
    WHERE 
        J.ExpireDate > GETDATE()                  -- Chỉ tính job đang mở (WHERE condition)
    GROUP BY 
        C.Industry                                -- GROUP BY Industry
    HAVING 
        COUNT(J.JobID) >= @MinJobCount            -- Param in HAVING condition
    ORDER BY 
        -- Kỹ thuật Dynamic Order By dùng CASE WHEN
        CASE WHEN @SortCriteria = 'QUANTITY' THEN COUNT(J.JobID) END DESC,
        CASE WHEN @SortCriteria = 'SALARY' THEN AVG(J.Salary) END DESC;
END;
GO

USE JobRecruitmentDB;
GO

-- Stored Procedure: Thống kê hệ thống (Requirement 3: Call Function/Procedure)
CREATE OR ALTER PROCEDURE sp_GetSystemStats
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Tính toán các chỉ số
    DECLARE @TotalUsers INT = (SELECT COUNT(*) FROM [USER]);
    DECLARE @TotalJobs INT = (SELECT COUNT(*) FROM [JOB]);
    DECLARE @TotalApplies INT = (SELECT COUNT(*) FROM [APPLY]);
    -- Tính trung bình rating từ bảng FEEDBACK (xử lý NULL nếu chưa có data)
    DECLARE @AvgCompanyRating DECIMAL(5,2) = (SELECT ISNULL(AVG(CAST([Rank] AS DECIMAL(5,2))), 0) FROM [FEEDBACK]);

    -- Trả về result set
    SELECT 
        @TotalUsers as TotalUsers,
        @TotalJobs as TotalJobs,
        @TotalApplies as TotalApplies,
        @AvgCompanyRating as AvgCompanyRating;
END;
GO