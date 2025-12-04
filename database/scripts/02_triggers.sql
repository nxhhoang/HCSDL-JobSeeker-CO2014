USE JobRecruitmentDB;
GO

-- ko thể apply nếu job đã hết hạn
-- thêm thông báo khi có ứng viên apply
CREATE OR ALTER TRIGGER trg_Apply_Insert
ON [dbo].[APPLY]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Kiểm tra job hết hạn
    IF EXISTS (
        SELECT 1
        FROM INSERTED i
        JOIN [dbo].[JOB] j ON i.JobID = j.JobID
        WHERE j.ExpireDate < GETDATE()
    )
    BEGIN
        RAISERROR ('Error: You cannot apply for a job that has already expired.', 16, 1);
        ROLLBACK TRANSACTION;
        -- thoát khỏi trigger
        RETURN;
    END
END;
GO

-- thông báo cho những follower của employer khi mà người đó đăng job mới
CREATE OR ALTER TRIGGER trg_NotifyFollowersOnNewJob
ON [dbo].[JOB]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Chèn dữ liệu vào bảng NOTIFY
    INSERT INTO [dbo].[NOTIFY] (CandidateID, JobID, EmployerID, Title, Content, [Timestamp])
    SELECT 
        f.CandidateID,              -- Người nhận (Candidate đang follow)
        i.JobID,                    -- ID công việc vừa tạo
        i.ID,                       -- Người gửi (Employer)
        N'New Job Alert',           -- Tiêu đề thông báo
        -- Nội dung: "Company ABC vừa đăng tuyển công việc XYZ"
        N'Company ' + u.Name + N' vừa đăng tuyển công việc: ' + i.JobName, 
        GETDATE()                   -- Thời gian hiện tại
    FROM inserted i
    -- 1. Tìm những người đang follow Employer này
    JOIN [dbo].[FOLLOW] f ON i.ID = f.EmployerID
    -- 2. Lấy tên của Employer để ghép vào nội dung tin nhắn
    JOIN [dbo].[USER] u ON i.ID = u.ID;
    PRINT 'Notifications sent to followers of the employer.';
END
GO

USE JobRecruitmentDB;
GO

CREATE OR ALTER TRIGGER trg_CascadeDeleteJob
ON [dbo].[JOB]
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DeletedJobIDs TABLE (JobID INT);
    INSERT INTO @DeletedJobIDs (JobID) SELECT JobID FROM deleted;

    -- Luôn xóa sạch dữ liệu liên quan để tránh lỗi Foreign Key
    DELETE FROM [dbo].[REQUIRE] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[IN] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[RELATE] WHERE VJobID IN (SELECT JobID FROM @DeletedJobIDs) OR RJobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[FEEDBACK] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[NOTIFY] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[APPLY] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs); -- Xóa hết đơn, kể cả Pending

    -- Cuối cùng xóa Job
    DELETE FROM [dbo].[JOB] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
END;
GO