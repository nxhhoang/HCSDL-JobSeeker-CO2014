USE JobRecruitmentDB;
GO

-- kiểm tra ứng viên có được phép feedback cho job hay không
-- chỉ khi được nhận thì mới được feedback
CREATE OR ALTER FUNCTION fn_CanFeedbackJob
(
    @CandidateID INT,
    @JobID INT
)
RETURNS BIT
AS
BEGIN
    DECLARE @Status NVARCHAR(50);

    -- Lấy trạng thái ứng tuyển của user đối với job này
    SELECT @Status = [Status]
    FROM [dbo].[APPLY]
    WHERE ID = @CandidateID AND JobID = @JobID;

    -- Kiểm tra điều kiện
    IF @Status IN (N'Đã nhận')
        RETURN 1; -- Được phép feedback

    RETURN 0; -- Không được phép
END;
GO

-- tính tổng số ứng viên đã ứng tuyển cho một job
CREATE OR ALTER FUNCTION fn_GetApplicantCount
(
    @JobID INT
)
RETURNS INT
AS 
BEGIN
    DECLARE @ApplicantCount INT;

    SELECT @ApplicantCount = COUNT(*)
    FROM [dbo].[APPLY]
    WHERE JobID = @JobID;

    RETURN ISNULL(@ApplicantCount, 0);
END;
GO

-- Tính trung bình đánh giá của employer dựa trên tất cả các feedback
CREATE OR ALTER FUNCTION fn_GetCompanyAvgRating
(
    @EmployerID INT
)
RETURNS DECIMAL(5, 2)
AS
BEGIN
    DECLARE @AvgRating DECIMAL(5, 2);

    -- Logic: Từ Employer -> Tìm các Job họ đăng -> Tìm các Feedback của các Job đó
    SELECT @AvgRating = AVG(CAST(f.[Rank] AS DECIMAL(5, 2)))
    FROM [dbo].[USER] u
    JOIN [dbo].[JOB] j ON u.ID = j.ID
    JOIN [dbo].[FEEDBACK] f ON j.JobID = f.JobID
    WHERE u.ID = @EmployerID AND u.UserType = 'Employer';

    -- Nếu chưa có đánh giá nào, trả về 0 thay vì NULL
    RETURN ISNULL(@AvgRating, 0);
END;
GO