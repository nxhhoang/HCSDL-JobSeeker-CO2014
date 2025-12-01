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

-- 1 người chỉ được apply vào 1 job 1 lần
CREATE OR ALTER TRIGGER trg_PreventDuplicateApply
ON [dbo].[APPLY]
INSTEAD OF INSERT
AS 
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM INSERTED i
        JOIN [dbo].[APPLY] a ON i.ID = a.ID AND i.JobID = a.JobID
    )
    BEGIN
        RAISERROR ('Error: You have already applied for this job.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Nếu không trùng, thực hiện chèn bình thường
    INSERT INTO [dbo].[APPLY] (ID, JobID, Date, CoverLetter, CV, [Status])
    SELECT ID, JobID, Date, CoverLetter, CV, [Status]
    FROM INSERTED;
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