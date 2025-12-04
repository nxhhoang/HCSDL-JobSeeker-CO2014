-- ========================================================================
-- LARGE DATASET
-- ========================================================================

USE JobRecruitmentDB;
GO

-- Clean up existing data for a fresh run
DELETE FROM [FEEDBACK]; DELETE FROM [OWN]; DELETE FROM [IN]; DELETE FROM [RELATE]; DELETE FROM [REQUIRE]; DELETE FROM [NOTIFY]; DELETE FROM [APPLY]; DELETE FROM [FOLLOW]; DELETE FROM [SOCIAL_LINK]; DELETE FROM [SENDMSG]; DELETE FROM [MESSAGE]; DELETE FROM [JOB_HISTORY]; DELETE FROM [JOB]; DELETE FROM [SKILL]; DELETE FROM [JOB_CATEGORY]; DELETE FROM [COMPANY]; DELETE FROM [PERSON]; DELETE FROM [USER]; DBCC CHECKIDENT ('[USER]', RESEED, 1); DBCC CHECKIDENT ('[JOB]', RESEED, 1); DBCC CHECKIDENT ('[SKILL]', RESEED, 1);

BEGIN TRANSACTION;
BEGIN TRY
    -- 1. INSERT SKILLS (40 Skills)
    INSERT INTO [dbo].[SKILL] (SkillName) VALUES 
    -- IT (1-10)
    (N'Java'), (N'Python'), (N'C#'), (N'ReactJS'), (N'NodeJS'), 
    (N'SQL Server'), (N'AWS Cloud'), (N'Docker'), (N'Flutter'), (N'Cyber Security'),
    -- Văn phòng & Ngôn ngữ (11-20)
    (N'Tiếng Anh (IELTS)'), (N'Tiếng Nhật (N2)'), (N'Tiếng Trung'), (N'Tiếng Hàn'), 
    (N'Excel nâng cao'), (N'PowerPoint'), (N'Giao tiếp'), (N'Thuyết trình'), (N'Quản lý thời gian'), (N'Làm việc nhóm'),
    -- Marketing & Design (21-30)
    (N'SEO'), (N'Google Ads'), (N'Content Writing'), (N'Photoshop'), (N'Illustrator'), 
    (N'Video Editing'), (N'Figma'), (N'Livestream'), (N'Chụp ảnh'), (N'Copywriting'),
    -- Lao động & Dịch vụ (31-40)
    (N'Lái xe B2'), (N'Lái xe C'), (N'Pha chế'), (N'Nấu ăn Âu'), (N'Sửa chữa điện'), 
    (N'Kỹ thuật máy lạnh'), (N'Gym PT'), (N'Makeup'), (N'Cắt tóc'), (N'Bảo mẫu');

    -- 2. INSERT JOB CATEGORIES
    INSERT INTO [dbo].[JOB_CATEGORY] (JCName, Speciality) VALUES 
    (N'Công nghệ thông tin', N'Software, Hardware'), 
    (N'Marketing - Truyền thông', N'Digital, Brand'), 
    (N'Kế toán - Tài chính', N'Tax, Audit'), 
    (N'Hành chính - Nhân sự', N'HR, Admin'), 
    (N'Cơ khí - Xây dựng', N'Engineer, Worker'), 
    (N'Dịch vụ khách hàng', N'CS, Receptionist'), 
    (N'Bán lẻ - Bán sỉ', N'Sales, Shop'), 
    (N'Giáo dục - Đào tạo', N'Tutor, Teacher'), 
    (N'Vận tải - Kho bãi', N'Driver, Logistics'), 
    (N'Nhà hàng - Khách sạn', N'Chef, Waiter'), 
    (N'Làm đẹp - Spa', N'Barber, Spa'), 
    (N'Lao động phổ thông', N'Helper, Worker');

    -- 3. INSERT USERS (60 Users)
    -- ID 1-30: Candidate
    -- ID 31-45: Individual Employer
    -- ID 46-60: Company Employer

    -- ID 61: Admin (sManager)
    INSERT INTO [dbo].[USER] (Username, [Password], Email, PhoneNum, Name, [Address], UserType, Bio, SSN, DOB) VALUES 
    -- TEAM CANDIDATE (1-30)
    (N'cand_dev1', N'123', N'dev1@mail.com', N'0901', N'Nguyễn Văn An', N'HCM', 'Candidate', N'Fullstack Java', 'C001', '1998-01-01'),
    (N'cand_dev2', N'123', N'dev2@mail.com', N'0902', N'Trần Thị Bích', N'Hà Nội', 'Candidate', N'Python AI', 'C002', '1999-02-02'),
    (N'cand_dev3', N'123', N'dev3@mail.com', N'0903', N'Lê Hoàng Cường', N'Đà Nẵng', 'Candidate', N'DB Admin', 'C003', '1995-03-03'),
    (N'cand_dev4', N'123', N'dev4@mail.com', N'0904', N'Phạm Minh Duy', N'HCM', 'Candidate', N'ReactJS Frontend', 'C004', '1997-04-04'),
    (N'cand_dev5', N'123', N'dev5@mail.com', N'0905', N'Hoàng Tuấn Tú', N'Cần Thơ', 'Candidate', N'Mobile Flutter', 'C005', '2000-05-05'),
    (N'cand_hr1', N'123', N'hr1@mail.com', N'0906', N'Vũ Thu Hà', N'HCM', 'Candidate', N'HR Specialist', 'C006', '1996-06-06'),
    (N'cand_acc1', N'123', N'acc1@mail.com', N'0907', N'Ngô Bảo Châu', N'Hà Nội', 'Candidate', N'Chief Accountant', 'C007', '1994-07-07'),
    (N'cand_sale1', N'123', N'sale1@mail.com', N'0908', N'Đinh Văn Mạnh', N'Hải Phòng', 'Candidate', N'Sales Real Estate', 'C008', '1998-08-08'),
    (N'cand_admin', N'123', N'adm@mail.com', N'0909', N'Lý Thảo My', N'HCM', 'Candidate', N'Admin Exec', 'C009', '2001-09-09'),
    (N'cand_mkt', N'123', N'mkt@mail.com', N'0910', N'Bùi Tiến Dũng', N'Đà Nẵng', 'Candidate', N'Digital Marketing', 'C010', '1999-10-10'),
    (N'cand_drive1', N'123', N'drv1@mail.com', N'0911', N'Trương Văn Ba', N'Bình Dương', 'Candidate', N'Tài xế dấu C', 'C011', '1985-01-01'),
    (N'cand_drive2', N'123', N'drv2@mail.com', N'0912', N'Nguyễn Văn Tư', N'Đồng Nai', 'Candidate', N'Tài xế công nghệ', 'C012', '1988-02-02'),
    (N'cand_cook', N'123', N'cook@mail.com', N'0913', N'Phan Thị Năm', N'Vũng Tàu', 'Candidate', N'Đầu bếp Âu', 'C013', '1990-03-03'),
    (N'cand_barista', N'123', N'bar@mail.com', N'0914', N'Lê Văn Sáu', N'Đà Lạt', 'Candidate', N'Barista', 'C014', '2002-04-04'),
    (N'cand_gym', N'123', N'gym@mail.com', N'0915', N'Phạm Đức Bảy', N'HCM', 'Candidate', N'PT Gym', 'C015', '1995-05-05'),
    (N'cand_spa', N'123', N'spa@mail.com', N'0916', N'Trần Thị Tám', N'Hà Nội', 'Candidate', N'KTV Spa', 'C016', '1998-06-06'),
    (N'cand_fix', N'123', N'fix@mail.com', N'0917', N'Nguyễn Văn Chín', N'HCM', 'Candidate', N'Thợ điện lạnh', 'C017', '1992-07-07'),
    (N'cand_ship', N'123', N'ship@mail.com', N'0918', N'Lê Văn Mười', N'HCM', 'Candidate', N'Shipper', 'C018', '2003-08-08'),
    (N'cand_sec', N'123', N'sec@mail.com', N'0919', N'Vũ Văn Vệ', N'Long An', 'Candidate', N'Bảo vệ', 'C019', '1980-09-09'),
    (N'cand_store', N'123', N'store@mail.com', N'0920', N'Phạm Thị Bán', N'Cần Thơ', 'Candidate', N'Nhân viên bán hàng', 'C020', '2000-10-10'),
    (N'sv_01', N'123', N'sv1@mail.com', N'0921', N'Nguyễn SV A', N'HCM', 'Candidate', N'Sinh viên IT', 'C021', '2003-01-01'),
    (N'sv_02', N'123', N'sv2@mail.com', N'0922', N'Trần SV B', N'Hà Nội', 'Candidate', N'Sinh viên KT', 'C022', '2004-02-02'),
    (N'sv_03', N'123', N'sv3@mail.com', N'0923', N'Lê SV C', N'Đà Nẵng', 'Candidate', N'Sinh viên Parttime', 'C023', '2003-03-03'),
    (N'sv_04', N'123', N'sv4@mail.com', N'0924', N'Phạm SV D', N'HCM', 'Candidate', N'Thực tập MKT', 'C024', '2004-04-04'),
    (N'sv_05', N'123', N'sv5@mail.com', N'0925', N'Hoàng SV E', N'HCM', 'Candidate', N'Gia sư', 'C025', '2003-05-05'),
    (N'sv_06', N'123', N'sv6@mail.com', N'0926', N'Vũ SV F', N'Hà Nội', 'Candidate', N'Sinh viên NN', 'C026', '2004-06-06'),
    (N'sv_07', N'123', N'sv7@mail.com', N'0927', N'Đặng SV G', N'Cần Thơ', 'Candidate', N'Phục vụ', 'C027', '2003-07-07'),
    (N'sv_08', N'123', N'sv8@mail.com', N'0928', N'Bùi SV H', N'Huế', 'Candidate', N'Sinh viên DL', 'C028', '2004-08-08'),
    (N'sv_09', N'123', N'sv9@mail.com', N'0929', N'Ngô SV I', N'HCM', 'Candidate', N'Intern HR', 'C029', '2003-09-09'),
    (N'sv_10', N'123', N'sv10@mail.com', N'0930', N'Dương SV K', N'Hà Nội', 'Candidate', N'Làm thêm', 'C030', '2004-10-10'),
    
    -- TEAM INDIVIDUAL EMPLOYER (31-45)
    (N'boss_cafe', N'123', N'cf@boss.com', N'0801', N'Chủ Cafe Mộc', N'HCM', 'Employer', N'Cafe Mộc', 'E01', '1985-01-01'),
    (N'boss_fashion', N'123', N'fs@boss.com', N'0802', N'Chủ Shop Váy', N'Hà Nội', 'Employer', N'Shop Xinh', 'E02', '1990-02-02'),
    (N'boss_garage', N'123', N'gr@boss.com', N'0803', N'Gara Tuấn', N'Bình Dương', 'Employer', N'Sửa xe', 'E03', '1980-03-03'),
    (N'boss_salon', N'123', N'sl@boss.com', N'0804', N'Salon Tóc', N'Đà Nẵng', 'Employer', N'Tóc Đẹp', 'E04', '1992-04-04'),
    (N'boss_res', N'123', N'res@boss.com', N'0805', N'Nhà Hàng Biển', N'Vũng Tàu', 'Employer', N'Hải sản', 'E05', '1988-05-05'),
    (N'boss_cons', N'123', N'cons@boss.com', N'0806', N'Cai Thầu', N'Long An', 'Employer', N'Xây dựng', 'E06', '1975-06-06'),
    (N'boss_log', N'123', N'log@boss.com', N'0807', N'Chủ Xe Tải', N'Đồng Nai', 'Employer', N'Vận tải', 'E07', '1982-07-07'),
    (N'boss_spa', N'123', N'spa@boss.com', N'0808', N'Spa Thảo Dược', N'HCM', 'Employer', N'Làm đẹp', 'E08', '1995-08-08'),
    (N'boss_farm', N'123', N'farm@boss.com', N'0809', N'Nông Trại', N'Đà Lạt', 'Employer', N'Rau sạch', 'E09', '1985-09-09'),
    (N'boss_tutor', N'123', N'tt@boss.com', N'0810', N'TT Gia Sư', N'Hà Nội', 'Employer', N'Giáo dục', 'E10', '1990-10-10'),
    (N'boss_bakery', N'123', N'bk@boss.com', N'0811', N'Tiệm Bánh', N'HCM', 'Employer', N'Bánh ngọt', 'E11', '1993-11-11'),
    (N'boss_mart', N'123', N'mt@boss.com', N'0812', N'Siêu Thị Mini', N'Cần Thơ', 'Employer', N'Bán lẻ', 'E12', '1989-12-12'),
    (N'boss_tech', N'123', N'tc@boss.com', N'0813', N'Startup Nhỏ', N'HCM', 'Employer', N'Công nghệ', 'E13', '1998-01-01'),
    (N'boss_hotel', N'123', N'ht@boss.com', N'0814', N'Khách Sạn', N'Nha Trang', 'Employer', N'Lưu trú', 'E14', '1980-02-02'),
    (N'boss_home', N'123', N'hm@boss.com', N'0815', N'Homestay', N'Lâm Đồng', 'Employer', N'Du lịch', 'E15', '1992-03-03'),

    -- TEAM COMPANY EMPLOYER (46-60)
    (N'comp_fpt', N'123', N'hr@fpt.com', N'0281', N'FPT Software', N'Khu CNC, HCM', 'Employer', N'Global IT', NULL, NULL),
    (N'comp_vng', N'123', N'hr@vng.com', N'0282', N'VNG Corp', N'Q7, HCM', 'Employer', N'Tech Unicorn', NULL, NULL),
    (N'comp_vin', N'123', N'hr@vin.com', N'0283', N'Vingroup', N'Bình Thạnh', 'Employer', N'Conglomerate', NULL, NULL),
    (N'comp_viettel', N'123', N'hr@viettel.com', N'0284', N'Viettel Group', N'Hà Nội', 'Employer', N'Telecom', NULL, NULL),
    (N'comp_shopee', N'123', N'hr@shopee.com', N'0285', N'Shopee VN', N'Q1, HCM', 'Employer', N'E-commerce', NULL, NULL),
    (N'comp_samsung', N'123', N'hr@samsung.com', N'0286', N'Samsung R&D', N'Hà Nội', 'Employer', N'Electronics', NULL, NULL),
    (N'comp_vcb', N'123', N'hr@vcb.com', N'0287', N'Vietcombank', N'Hà Nội', 'Employer', N'Banking', NULL, NULL),
    (N'comp_uni', N'123', N'hr@uni.com', N'0288', N'Unilever', N'Q7, HCM', 'Employer', N'FMCG', NULL, NULL),
    (N'comp_pepsi', N'123', N'hr@pepsi.com', N'0289', N'PepsiCo', N'Q1, HCM', 'Employer', N'Beverage', NULL, NULL),
    (N'comp_nash', N'123', N'hr@nash.com', N'0290', N'NashTech', N'HCM', 'Employer', N'IT Sol', NULL, NULL),
    (N'comp_intel', N'123', N'hr@intel.com', N'0291', N'Intel', N'Khu CNC', 'Employer', N'Chip', NULL, NULL),
    (N'comp_bosch', N'123', N'hr@bosch.com', N'0292', N'Bosch', N'Tân Bình', 'Employer', N'Eng', NULL, NULL),
    (N'comp_hpg', N'123', N'hr@hpg.com', N'0293', N'Hòa Phát', N'Hà Nội', 'Employer', N'Steel', NULL, NULL),
    (N'comp_vna', N'123', N'hr@vna.com', N'0294', N'VNA', N'Hà Nội', 'Employer', N'Airline', NULL, NULL),
    (N'comp_thaco', N'123', N'hr@thaco.com', N'0295', N'THACO', N'Quảng Nam', 'Employer', N'Auto', NULL, NULL),

    -- ADMIN
    (N'sManager', N'password', N'sManager', N'sManager', N'sManager', N'JobSeeker', 'Admin', N'Super User', 'C000', 
    '1111-01-01');

    -- 4. INSERT PERSON & COMPANY DETAILS
    -- INSERT INTO [dbo].[PERSON] (SSN, ID, DOB) SELECT SSN, ID, DOB FROM [dbo].[USER] WHERE ID BETWEEN 31 AND 45;
    INSERT INTO [dbo].[PERSON] (SSN, ID, DOB) VALUES
    ('E01', 31, '1985-01-01'),
    ('E02', 32, '1990-02-02'),
    ('E03', 33, '1980-03-03'),
    ('E04', 34, '1992-04-04'),
    ('E05', 35, '1988-05-05'),
    ('E06', 36, '1975-06-06'),
    ('E07', 37, '1982-07-07'),
    ('E08', 38, '1995-08-08'),
    ('E09', 39, '1985-09-09'),
    ('E10', 40, '1990-10-10'),
    ('E11', 41, '1993-11-11'),
    ('E12', 42, '1989-12-12'),
    ('E13', 43, '1998-01-01'),
    ('E14', 44, '1980-02-02'),
    ('E15', 45, '1992-03-03');
    
    INSERT INTO [dbo].[COMPANY] (TaxNumber, FoundedDate, Industry, Size, Country, Website, ID) VALUES
    ('0000000046', '1999-01-01', N'IT', N'10000+', N'VN', 'https://fpt.com', 46),
    ('0000000047', '2004-01-01', N'Tech', N'5000+', N'VN', 'https://vng.com', 47),
    ('0000000048', '1993-01-01', N'Multi', N'50000+', N'VN', 'https://vin.com', 48),
    ('0000000049', '1989-01-01', N'Tel', N'40000+', N'VN', 'https://viettel.com', 49),
    ('0000000050', '2015-01-01', N'Ecom', N'2000+', N'SG', 'https://shopee.vn', 50),
    ('0000000051', '2010-01-01', N'Elec', N'10000+', N'KR', 'https://samsung.com', 51),
    ('0000000052', '1963-01-01', N'Bank', N'20000+', N'VN', 'https://vcb.com', 52),
    ('0000000053', '1995-01-01', N'FMCG', N'1000+', N'Global', 'https://unilever.com', 53),
    ('0000000054', '1994-01-01', N'F&B', N'1000+', N'Global', 'https://pepsi.com', 54),
    ('0000000055', '2000-01-01', N'IT', N'2000+', N'UK', 'https://nashtech.com', 55),
    ('0000000056', '2006-01-01', N'HW', N'3000+', N'USA', 'https://intel.com', 56),
    ('0000000057', '2010-01-01', N'Eng', N'3000+', N'DE', 'https://bosch.com', 57),
    ('0000000058', '1992-01-01', N'Steel', N'25000+', N'VN', 'https://hoaphat.com', 58),
    ('0000000059', '1956-01-01', N'Air', N'15000+', N'VN', 'https://vna.com', 59),
    ('0000000060', '1997-01-01', N'Auto', N'20000+', N'VN', 'https://thaco.com', 60);


    -- 5. INSERT JOBS (48 Jobs)
    INSERT INTO [dbo].[JOB] (JobName, Salary, Quantity, ID, [Location], [Level], PostDate, ExpireDate, JobType) VALUES 
    -- Company Jobs (1-21)
    (N'Junior Java', 1200, 10, 46, N'HCM', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Senior Java', 2500, 5, 46, N'HCM', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Solution Arch', 4000, 1, 46, N'HN', N'Manager', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Game Designer', 1500, 3, 47, N'HCM', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'DevOps Eng', 2500, 2, 47, N'HCM', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'ReactJS FE', 1200, 5, 55, N'HCM', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'.NET Dev', 1800, 4, 55, N'HN', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Embedded Eng', 2200, 5, 57, N'HCM', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Data Scientist', 3000, 2, 50, N'HN', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Product Owner', 2800, 1, 50, N'HCM', N'Manager', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Giao dịch viên', 700, 20, 52, N'HN', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'CV Tín dụng', 1000, 10, 52, N'HCM', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Kỹ sư Cơ khí', 1200, 5, 58, N'HY', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Quản lý Kho', 1500, 2, 58, N'QN', N'Manager', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Tiếp viên HK', 1500, 50, 59, N'VN', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Phi công', 3000, 10, 59, N'HCM', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Sale BĐS', 800, 20, 48, N'HCM', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'QL Dự án XD', 2500, 2, 48, N'HN', N'Manager', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Marketing Exec', 900, 5, 53, N'HCM', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Brand Manager', 4000, 1, 54, N'HCM', N'Director', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Kỹ sư Lắp ráp', 1100, 15, 60, N'QN', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    -- Individual Jobs (22-45)
    (N'Pha chế Cafe', 300, 2, 31, N'HCM', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Shift'),
    (N'Phục vụ', 200, 5, 31, N'HCM', N'Part-time', DEFAULT, DATEADD(d, 30, GETDATE()), N'Part-time'),
    (N'Bán quần áo', 250, 2, 32, N'HN', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Shift'),
    (N'Mẫu ảnh', 500, 1, 32, N'HN', N'Freelance', DEFAULT, DATEADD(d, 30, GETDATE()), N'Contract'),
    (N'Sửa ô tô', 800, 3, 33, N'BD', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Phụ gara', 400, 2, 33, N'BD', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Thợ cắt tóc', 1000, 2, 34, N'DN', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Gội đầu', 300, 3, 34, N'DN', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Bếp chính', 1200, 1, 35, N'VT', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Phụ bếp', 400, 3, 35, N'VT', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Thợ hồ', 500, 10, 36, N'LA', N'Manual', DEFAULT, DATEADD(d, 30, GETDATE()), N'Contract'),
    (N'Lái xe tải', 900, 5, 37, N'DN', N'Senior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Lơ xe', 400, 5, 37, N'DN', N'Manual', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'KTV Spa', 700, 4, 38, N'HCM', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'KS Nông nghiệp', 800, 2, 39, N'DL', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Gia sư Toán', 150, 5, 40, N'HN', N'Part-time', DEFAULT, DATEADD(d, 30, GETDATE()), N'Part-time'),
    (N'Thợ làm bánh', 600, 2, 41, N'HCM', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Thu ngân', 250, 3, 42, N'CT', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Shift'),
    (N'IT Support', 200, 1, 43, N'HCM', N'Intern', DEFAULT, DATEADD(d, 30, GETDATE()), N'Part-time'),
    (N'Lễ tân', 400, 2, 44, N'NT', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Shift'),
    (N'Quản gia', 500, 1, 45, N'DL', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Fresher Unity', 500, 10, 47, N'HCM', N'Fresher', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Comtor', 1200, 3, 46, N'DN', N'Junior', DEFAULT, DATEADD(d, 30, GETDATE()), N'Full-time'),
    (N'Intern MKT', 100, 5, 50, N'HN', N'Intern', DEFAULT, DATEADD(d, 30, GETDATE()), N'Internship');
    PRINT '>> Inserted Main Data (Users, Jobs, Skills)';

    -- 6. INSERT IN (JOB CATEGORIES)
    INSERT INTO [dbo].[IN] (JCName, JobID) VALUES
    (N'Công nghệ thông tin', 1), (N'Công nghệ thông tin', 2), (N'Công nghệ thông tin', 3), (N'Công nghệ thông tin', 4),
    (N'Công nghệ thông tin', 5), (N'Công nghệ thông tin', 6), (N'Công nghệ thông tin', 7), (N'Công nghệ thông tin', 8),
    (N'Công nghệ thông tin', 9), (N'Công nghệ thông tin', 10), (N'Dịch vụ khách hàng', 11), (N'Kế toán - Tài chính', 12),
    (N'Cơ khí - Xây dựng', 13), (N'Vận tải - Kho bãi', 14), (N'Dịch vụ khách hàng', 15), (N'Vận tải - Kho bãi', 16),
    (N'Bán lẻ - Bán sỉ', 17), (N'Cơ khí - Xây dựng', 18), (N'Marketing - Truyền thông', 19), (N'Marketing - Truyền thông', 20),
    (N'Cơ khí - Xây dựng', 21), (N'Nhà hàng - Khách sạn', 22), (N'Nhà hàng - Khách sạn', 23), (N'Bán lẻ - Bán sỉ', 24),
    (N'Marketing - Truyền thông', 25), (N'Cơ khí - Xây dựng', 26), (N'Lao động phổ thông', 27), (N'Làm đẹp - Spa', 28),
    (N'Làm đẹp - Spa', 29), (N'Nhà hàng - Khách sạn', 30), (N'Lao động phổ thông', 31), (N'Cơ khí - Xây dựng', 32),
    (N'Vận tải - Kho bãi', 33), (N'Lao động phổ thông', 34), (N'Làm đẹp - Spa', 35), (N'Giáo dục - Đào tạo', 37),
    (N'Giáo dục - Đào tạo', 38), (N'Nhà hàng - Khách sạn', 39), (N'Bán lẻ - Bán sỉ', 40), (N'Công nghệ thông tin', 43),
    (N'Nhà hàng - Khách sạn', 44), (N'Nhà hàng - Khách sạn', 45);

    -- 7. INSERT REQUIRE (JOB SKILLS)
    INSERT INTO [dbo].[REQUIRE] (JobID, SkillID) VALUES
    (1, 1), (1, 6), (2, 1), (2, 7), (4, 24), (4, 27), (5, 8), (5, 7), (5, 2), 
    (11, 17), (11, 15), (22, 33), (22, 17), (33, 32), (20, 21), (20, 19), (20, 11),
    (6, 3), (6, 6), (7, 2), (7, 9), (9, 10), (9, 12), (10, 14), (10, 11),
    (12, 18), (12, 15), (14, 16), (14, 15), (16, 17), (16, 15), (19, 22),
    (19, 20), (21, 13), (21, 15), (24, 25), (24, 26), (25, 21), (25, 19),
    (26, 34), (26, 15), (29, 29), (29, 30), (30, 31), (30, 32), (38, 36),
    (38, 15), (39, 33), (39, 17);

    -- 8. INSERT OWN (CANDIDATE SKILLS)
    INSERT INTO [dbo].[OWN] (ID, SkillID) VALUES
    (1, 1), (1, 6), (1, 4), (2, 2), (2, 6), (2, 11), (6, 17), (6, 15), (6, 11),
    (11, 32), (11, 35), (13, 34), (13, 33), (21, 1), (21, 3), (5, 9), (5, 1);

    -- =========================================================
    -- 9. INSERT JOB_HISTORY
    -- =========================================================
    INSERT INTO [dbo].[JOB_HISTORY] (CandidateID, Position, ComName, StartTime, EndTime) VALUES
    -- Lịch sử cũ
    (1, N'Intern Java', N'FPT', '2020-06-01', '2020-12-31'), 
    (1, N'Junior Dev', N'CMC', '2021-01-01', '2022-05-01'),
    (2, N'DA', N'TopCV', '2021-06-01', '2023-01-01'), 
    (11, N'Tài xế', N'Taxi Group', '2010-01-01', '2015-01-01'),
    (13, N'Bếp', N'Nhà hàng Á', '2015-01-01', '2018-01-01'), 
    (21, N'Intern', N'MISA', '2023-01-01', '2023-04-01'),
    -- Dữ liệu MỚI THÊM
    (3, N'DB Admin', N'Sacombank', '2019-01-01', '2022-01-01'), -- Cand 3
    (4, N'Frontend Dev', N'Freelance', '2020-01-01', '2021-01-01'), -- Cand 4
    (6, N'Tuyển dụng', N'Manpower', '2018-05-01', '2021-05-01'), -- HR
    (7, N'Kế toán viên', N'Công ty Xây dựng', '2017-01-01', '2020-12-31'), -- Acc
    (8, N'Sales BĐS', N'Đất Xanh', '2020-01-01', '2023-01-01'), -- Sale
    (17, N'Thợ điện', N'Điện lực TP', '2015-01-01', '2019-01-01'), -- Fixer
    (19, N'Bảo vệ', N'Công ty Bảo vệ Long Hải', '2010-01-01', '2020-01-01'); -- Security

    -- =========================================================
    -- 10. INSERT SOCIAL_LINK
    -- =========================================================
    INSERT INTO [dbo].[SOCIAL_LINK] (SSN, Link) VALUES
    -- Employer Links
    ('E01', 'fb.com/cafemoc'), ('E02', 'insta.com/shop'), ('E03', 'zalo.me/gara'), 
    ('E04', 'tiktok.com/@toc'), ('E05', 'fb.com/bien'),
    ('E06', 'fb.com/thauxaydung'), 
    ('E07', 'zalo.me/xetai'),
    ('E08', 'insta.com/spathaoduoc'),
    ('E09', 'fb.com/nongtraixanh'),
    ('E10', 'web.giasu.com');

    -- =========================================================
    -- 11. INSERT APPLY
    -- =========================================================
    INSERT INTO [dbo].[APPLY] (ID, JobID, Status, [Date]) VALUES
    -- Dữ liệu cũ
    (1, 1, N'Đã nhận', '2023-10-01'), (1, 4, N'Từ chối', '2023-09-15'), 
    (2, 9, N'Chờ duyệt', GETDATE()), (2, 5, N'Chờ duyệt', GETDATE()), 
    (11, 33, N'Đã nhận', '2023-10-20'), (13, 30, N'Từ chối', '2023-09-01'),
    (13, 31, N'Đã nhận', '2023-09-05'),
    -- Dữ liệu MỚI THÊM
    -- Job 1 (Junior Java) rất hot, nhiều người nộp
    (4, 1, N'Chờ duyệt', GETDATE()), 
    (5, 1, N'Từ chối', '2023-09-20'), 
    (21, 1, N'Chờ duyệt', GETDATE()),
    -- Cand 10 (Digital MKT) nộp nhiều nơi
    (10, 19, N'Đã nhận', '2023-11-01'), -- Marketing Exec
    (10, 20, N'Chờ duyệt', GETDATE()),   -- Brand Manager
    -- Các Job lao động phổ thông
    (17, 26, N'Đã nhận', '2023-10-15'), -- Thợ sửa xe -> Phụ gara (Job 26)
    (18, 23, N'Chờ duyệt', '2023-10-10'), -- Shipper -> Phục vụ (Job 23)
    (20, 38, N'Chờ duyệt', GETDATE()),   -- Bán hàng -> Thu ngân (Job 38)
    (15, 34, N'Từ chối', '2023-09-01'); -- Gym PT -> KTV Spa (Job 34 - trái nghề)

    -- =========================================================
    -- 12. INSERT MESSAGE & SENDMSG (MỞ RỘNG)
    -- =========================================================
    INSERT INTO [dbo].[MESSAGE] (SenderID, ReceiverID, Content) VALUES
    -- Hội thoại cũ
    (1, 46, N'Đã gửi CV'), (46, 1, N'Đã nhận'), (11, 37, N'Hỏi tuyến chạy'), 
    (37, 11, N'Tuyến Bắc Nam'), (47, 2, N'Mời PV'), (2, 47, N'OK'),
    -- Hội thoại MỚI
    (10, 53, N'Em có kinh nghiệm chạy Ads 2 năm ạ'), -- Cand 10 chat Employer 53 (Unilever)
    (53, 10, N'Chào bạn, mời bạn gửi portfolio qua mail'),
    (17, 33, N'Gara mình còn tuyển thợ phụ không anh?'), -- Cand 17 chat Employer 33 (Gara)
    (33, 17, N'Còn em nhé, em qua trực tiếp phỏng vấn'),
    (5, 46, N'Bên mình có tuyển Remote không ạ?'), -- Cand 5 chat FPT
    (46, 5, N'Hiện tại bên mình chỉ tuyển Onsite thôi bạn');

    -- Cập nhật bảng SENDMSG cho các tin nhắn mới
    INSERT INTO [dbo].[SENDMSG] (SenderID, ReceiverID) VALUES 
    (10, 53), (53, 10), (17, 33), (33, 17), (5, 46), (46, 5);

    -- =========================================================
    -- 13. INSERT NOTIFY & FOLLOW (MỞ RỘNG)
    -- =========================================================
    INSERT INTO [dbo].[NOTIFY] (CandidateID, JobID, EmployerID, Content) VALUES
    -- Thông báo cũ
    (1, 1, 46, N'Đã duyệt'), (1, 4, 47, N'Từ chối'), (11, 33, 37, N'Mời PV'),
    -- Thông báo MỚI
    (10, 19, 53, N'Chúc mừng bạn đã trúng tuyển vị trí Marketing'),
    (5, 1, 46, N'Hồ sơ của bạn chưa phù hợp'),
    (13, 31, 35, N'Lịch làm việc của bạn bắt đầu từ thứ 2');

    INSERT INTO [dbo].[FOLLOW] (EmployerID, CandidateID) VALUES 
    (46, 1), (46, 2), (47, 2), (31, 14), (37, 11),
    (46, 3), -- FPT follow Senior DB Admin
    (46, 4), -- FPT follow ReactJS Dev
    (50, 2), -- Shopee follow AI Engineer
    (33, 17); -- Gara follow Thợ điện/cơ

    -- =========================================================
    -- 14. INSERT RELATE & FEEDBACK (MỞ RỘNG)
    -- =========================================================
    INSERT INTO [dbo].[RELATE] (VJobID, RJobID) VALUES 
    (1, 2), (30, 31), (33, 34),
    -- Relate MỚI
    (6, 7),   -- ReactJS <-> .NET (Frontend/Backend web context)
    (15, 16), -- Tiếp viên HK <-> Phi công
    (22, 23), -- Pha chế <-> Phục vụ
    (25, 26); -- Sửa ô tô <-> Phụ gara

    INSERT INTO [dbo].[FEEDBACK] (ID, JobID, Content, [Rank]) VALUES
    -- Feedback cũ
    (1, 1, N'Good process', 5), (13, 31, N'Hot kitchen', 4), (11, 33, N'Nice truck', 5),
    -- Feedback MỚI
    (17, 26, N'Chủ gara vui tính, hướng dẫn nhiệt tình', 5),
    (18, 23, N'Lương hơi thấp so với mặt bằng chung', 3),
    (15, 34, N'Môi trường làm việc chuyên nghiệp', 5);

    COMMIT TRANSACTION;
    PRINT 'SUCCESS: Full Database Created with EXTENDED Data.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'ERROR: ' + ERROR_MESSAGE();
END CATCH
GO



-- ========================================================================
-- SMALL DATASET FOR TESTING PURPOSES
-- ========================================================================

-- USE JobRecruitmentDB;
-- GO

-- -- Clean up existing data for a fresh run
-- DELETE FROM [FEEDBACK]; DELETE FROM [OWN]; DELETE FROM [IN]; DELETE FROM [RELATE]; DELETE FROM [REQUIRE]; DELETE FROM [NOTIFY]; DELETE FROM [APPLY]; DELETE FROM [FOLLOW]; DELETE FROM [SOCIAL_LINK]; DELETE FROM [SENDMSG]; DELETE FROM [MESSAGE]; DELETE FROM [JOB_HISTORY]; DELETE FROM [JOB]; DELETE FROM [SKILL]; DELETE FROM [JOB_CATEGORY]; DELETE FROM [COMPANY]; DELETE FROM [PERSON]; DELETE FROM [USER]; DBCC CHECKIDENT ('[USER]', RESEED, 1); DBCC CHECKIDENT ('[JOB]', RESEED, 1); DBCC CHECKIDENT ('[SKILL]', RESEED, 1);

-- BEGIN TRANSACTION;
-- BEGIN TRY

--     -- =========================================================
--     -- 1. INSERT USERS (Total 15)
--     -- Logic: 
--     -- Candidates (ID 1-8): Have SSN/DOB, UserType='Candidate'. NOT in Person/Company.
--     -- Individual Employers (ID 9-16): Have SSN/DOB, UserType='Employer'. ALSO in Person.
--     -- Corporate Employers (ID 17-24): No SSN/DOB here, UserType='Employer'. ALSO in Company.
--     -- =========================================================
    
--     INSERT INTO [dbo].[USER] (Username, [Password], Email, PhoneNum, Name, [Address], UserType, Bio, SSN, DOB)
--     VALUES 
--     -- CANDIDATES (1-8)
--     (N'candidate1', N'pass', N'c1@mail.com', N'0901000001', N'Nguyễn Văn A', N'TP.HCM', 'Candidate', N'Fresher Developer', '079099000001', '1999-01-01'),
--     (N'candidate2', N'pass', N'c2@mail.com', N'0901000002', N'Trần Thị B', N'Hà Nội', 'Candidate', N'Kế toán tổng hợp', '079099000002', '1995-05-05'),
--     (N'candidate3', N'pass', N'c3@mail.com', N'0901000003', N'Lê Văn C', N'Đà Nẵng', 'Candidate', N'Salesman', '079099000003', '2000-10-10'),
--     (N'candidate4', N'pass', N'c4@mail.com', N'0901000004', N'Phạm Thị D', N'Cần Thơ', 'Candidate', N'Graphic Designer', '079099000004', '1998-12-12'),
--     (N'candidate5', N'pass', N'c5@mail.com', N'0901000005', N'Hoàng Văn E', N'Bình Dương', 'Candidate', N'Tài xế', '079099000005', '1990-06-20'),
--     (N'candidate6', N'pass', N'c6@mail.com', N'0901000006', N'Vũ Thị F', N'Hải Phòng', 'Candidate', N'Mobile Developer', '079099000006', '1997-03-15'),
--     (N'candidate7', N'pass', N'c7@mail.com', N'0901000007', N'Đặng Văn G', N'TP.HCM', 'Candidate', N'Phiên dịch viên tiếng Hàn', '079099000007', '1996-08-20'),
--     (N'candidate8', N'pass', N'c8@mail.com', N'0901000008', N'Bùi Thị H', N'Đà Nẵng', 'Candidate', N'Sinh viên thực tập Marketing', '079099000008', '2003-01-10'),

--     -- INDIVIDUAL EMPLOYERS (9-16)
--     (N'shopowner1', N'pass', N's1@mail.com', N'0902000001', N'Chủ Shop Hoa', N'TP.HCM', 'Employer', N'Tìm nhân viên bán hoa', '080088000001', '1980-01-01'),
--     (N'freelancer1', N'pass', N'f1@mail.com', N'0902000002', N'Dev Lead', N'Hà Nội', 'Employer', N'Tìm trợ lý code', '080088000002', '1985-05-05'),
--     (N'cafeowner', N'pass', N'cafe@mail.com', N'0902000003', N'Chủ Quán Cafe', N'Đà Nẵng', 'Employer', N'Tuyển pha chế', '080088000003', '1990-02-02'),
--     (N'hiringmgr1', N'pass', N'h1@mail.com', N'0902000004', N'Trưởng Nhóm Sale', N'HCM', 'Employer', N'Cần CTV', '080088000004', '1988-08-08'),
--     (N'tutor', N'pass', N'tutor@mail.com', N'0902000005', N'Gia Sư Minh', N'Hà Nội', 'Employer', N'Tìm sinh viên dạy kèm', '080088000005', '1992-03-03'),
--     (N'gymowner', N'pass', N'gym@mail.com', N'0902000006', N'Anh Chủ Gym', N'TP.HCM', 'Employer', N'Tuyển PT phòng tập', '080088000006', '1985-07-07'),
--     (N'contentlead', N'pass', N'content@mail.com', N'0902000007', N'Chị Content Lead', N'Hà Nội', 'Employer', N'Tìm bạn viết bài chuẩn SEO', '080088000007', '1991-09-09'),
--     (N'homestay', N'pass', N'home@mail.com', N'0902000008', N'Chủ Homestay Đà Lạt', N'Lâm Đồng', 'Employer', N'Cần quản gia', '080088000008', '1982-12-12'),

--     -- CORPORATE EMPLOYERS (17-24)
--     (N'fpt', N'pass', N'hr@fpt.com', N'0283333333', N'FPT Software', N'Khu CNC', 'Employer', N'Top IT Company', NULL, NULL),
--     (N'vng', N'pass', N'hr@vng.com', N'0284444444', N'VNG Corp', N'Q7', 'Employer', N'Tech Unicorn', NULL, NULL),
--     (N'vingroup', N'pass', N'hr@vin.com', N'0285555555', N'Vingroup', N'Bình Thạnh', 'Employer', N'Real Estate', NULL, NULL),
--     (N'viettel', N'pass', N'hr@viettel.com', N'0246666666', N'Viettel Group', N'Hà Nội', 'Employer', N'Telecom', NULL, NULL),
--     (N'shopee', N'pass', N'hr@shopee.com', N'0287777777', N'Shopee VN', N'Q1', 'Employer', N'E-commerce', NULL, NULL),
--     (N'nashtech', N'pass', N'hr@nash.com', N'0288888888', N'NashTech Vietnam', N'TP.HCM', 'Employer', N'Global Technology Solutions', NULL, NULL),
--     (N'samsung', N'pass', N'hr@samsung.com', N'0249999999', N'Samsung R&D', N'Hà Nội', 'Employer', N'World leading Tech', NULL, NULL),
--     (N'techcombank', N'pass', N'hr@techcom.com', N'0241111111', N'Techcombank', N'Hà Nội', 'Employer', N'Ngân hàng TMCP Kỹ Thương', NULL, NULL);

--     PRINT 'Users inserted.';

--     -- =========================================================
--     -- 2. INSERT INTO PERSON (Only Individual Employers - IDs 9-18)
--     -- =========================================================
--     INSERT INTO [dbo].[PERSON] (SSN, ID)
--     VALUES 
--     ('080088000001', 9),
--     ('080088000002', 10),
--     ('080088000003', 11),
--     ('080088000004', 12),
--     ('080088000005', 13),
--     ('080088000006', 14),
--     ('080088000007', 15),
--     ('080088000008', 16);
--     PRINT 'Person table inserted.';

--     -- =========================================================
--     -- 3. INSERT INTO COMPANY (Only Corporate Employers - IDs 11-15)
--     -- =========================================================
--     INSERT INTO [dbo].[COMPANY] (TaxNumber, FoundedDate, Industry, Size, Country, Website, ID)
--     VALUES 
--     ('0101234567', '1999-01-01', N'IT', N'10000+', N'Vietnam', 'https://fpt.com', 17),
--     ('0301234567', '2004-09-09', N'Internet', N'3000+', N'Vietnam', 'https://vng.com.vn', 18),
--     ('0401234567', '1993-08-08', N'Multi', N'50000+', N'Vietnam', 'https://vingroup.net', 19),
--     ('0501234567', '1989-06-01', N'Telecom', N'40000+', N'Vietnam', 'https://viettel.com.vn', 20),
--     ('0601234567', '2015-01-01', N'E-commerce', N'2000+', N'Singapore', 'https://shopee.vn', 21),
--     ('0701234567', '2000-01-01', N'Outsourcing', N'5000+', N'UK', 'https://nashtech.com', 22),
--     ('0801234567', '2010-05-05', N'Electronics', N'10000+', N'Korea', 'https://samsung.com', 23),
--     ('0901234567', '1993-09-27', N'Banking', N'12000+', N'Vietnam', 'https://techcombank.com', 24);
--     PRINT 'Company table inserted.';

--     -- =========================================================
--     -- 4. INSERT JOB CATEGORIES
--     -- =========================================================
--     INSERT INTO [dbo].[JOB_CATEGORY] (JCName, Speciality) VALUES 
--     (N'Công nghệ thông tin', N'Software, Hardware'),
--     (N'Dịch vụ', N'F&B, Hotel'),
--     (N'Bán lẻ', N'Sales, Store Management'),
--     (N'Giáo dục', N'Teaching, Tutoring'),
--     (N'Thiết kế', N'Graphic, UI/UX'),
--     (N'Sức khỏe', N'Fitness, Y tế'), 
--     (N'Du lịch', N'Guide, Hotel, Homestay');

--     -- =========================================================
--     -- 5. INSERT SKILLS
--     -- =========================================================
--     INSERT INTO [dbo].[SKILL] (SkillName) VALUES 
--     (N'Java'), (N'Pha chế'), (N'Giao tiếp'), (N'Photoshop'), (N'Tiếng Anh'), 
--     (N'Lái xe'), (N'Python'), (N'Sales'), (N'Quản lý'), (N'Flutter'), 
--     (N'Tiếng Hàn'), (N'SEO Marketing'), (N'Gym Training'), (N'Housekeeping'), (N'.NET');

--     -- =========================================================
--     -- 6. INSERT JOBS (5 by Companies, 5 by Individuals)
--     -- =========================================================
--     INSERT INTO [dbo].[JOB] (JobName, Salary, Quantity, ID, ExpireDate, [Location]) VALUES 
--     -- From Companies
--     (N'Java Developer', 1500, 10, 17, DATEADD(d, 30, GETDATE()), N'HCM'), -- FPT
--     (N'Game Designer', 2000, 5, 18, DATEADD(d, 30, GETDATE()), N'HCM'),   -- VNG
--     (N'Sales Manager', 1200, 2, 19, DATEADD(d, 30, GETDATE()), N'HCM'),   -- Vin
--     (N'Network Admin', 1000, 5, 20, DATEADD(d, 30, GETDATE()), N'Hanoi'), -- Viettel
--     (N'Marketing Exec', 900, 3, 21, DATEADD(d, 30, GETDATE()), N'HCM'),   -- Shopee
--     (N'Senior .NET Developer', 2200, 5, 22, DATEADD(d, 45, GETDATE()), N'TP.HCM'), -- NashTech
--     (N'Mobile QA Engineer', 1800, 10, 23, DATEADD(d, 60, GETDATE()), N'Hà Nội'), -- Samsung
--     (N'Bank Teller', 700, 20, 24, DATEADD(d, 15, GETDATE()), N'Hà Nội'), -- Techcombank
--     (N'Solution Architect', 3000, 1, 17, DATEADD(d, 60, GETDATE()), N'TP.HCM'), -- FPT (More jobs)
--     (N'Customer Support', 500, 50, 21, DATEADD(d, 20, GETDATE()), N'TP.HCM'), -- Shopee (More jobs)

--     -- From Individuals
--     (N'Nhân viên bán hoa', 300, 1, 9, DATEADD(d, 15, GETDATE()), N'HCM'),
--     (N'Trợ lý lập trình', 500, 1, 10, DATEADD(d, 15, GETDATE()), N'Hanoi'),
--     (N'Nhân viên pha chế', 250, 2, 11, DATEADD(d, 15, GETDATE()), N'Danang'),
--     (N'Cộng tác viên Sale', 200, 5, 12, DATEADD(d, 15, GETDATE()), N'HCM'),
--     (N'Gia sư Toán', 150, 1, 13, DATEADD(d, 15, GETDATE()), N'Hanoi'),
--     (N'Huấn luyện viên Gym (PT)', 600, 2, 14, DATEADD(d, 20, GETDATE()), N'TP.HCM'),
--     (N'CTV Viết bài SEO', 100, 5, 15, DATEADD(d, 10, GETDATE()), N'Remote'),
--     (N'Quản gia Homestay', 350, 1, 16, DATEADD(d, 30, GETDATE()), N'Đà Lạt');
--     PRINT 'Jobs inserted.';

--     -- =========================================================
--     -- 7. INSERT JOB_HISTORY (For Candidates ID 1-5)
--     -- =========================================================
--     INSERT INTO [dbo].[JOB_HISTORY] (CandidateID, Position, ComName, StartTime, EndTime) VALUES
--     (1, N'Intern', N'Tech Com', '2022-01-01', '2022-06-01'),
--     (2, N'Junior Accountant', N'Audit Firm', '2020-01-01', '2022-01-01'),
--     (3, N'Waiter', N'Coffee House', '2021-01-01', '2021-12-31'),
--     (4, N'Freelancer', N'Self', '2020-01-01', '2023-01-01'),
--     (5, N'Driver', N'Mai Linh', '2015-01-01', '2020-01-01'),
--     (6, N'Mobile Intern', N'Startup ABC', '2021-06-01', '2021-12-01'), 
--     (7, N'Translator', N'LG Display', '2019-01-01', '2023-01-01');
--     -- Cand 8 is student

--     -- =========================================================
--     -- 8. INSERT SOCIAL_LINK (For Employer Person)
--     -- =========================================================
--     INSERT INTO [dbo].[SOCIAL_LINK] (SSN, Link) VALUES
--     ('080088000001', N'facebook.com/shophoa'),
--     ('080088000002', N'linkedin.com/in/freelancer1'),
--     ('080088000003', N'facebook.com/cafeowner'),
--     ('080088000004', N'linkedin.com/in/hiringmgr1'),
--     ('080088000005', N'facebook.com/tutor'),
--     ('080088000006', N'facebook.com/gymowner'),
--     ('080088000007', N'linkedin.com/in/contentlead'),
--     ('080088000008', N'instagram.com/homestaydalat');

--     -- =========================================================
--     -- 9. INSERT APPLY (Candidates applying)
--     -- =========================================================
--     -- Mapping Job IDs roughly: 1-10 (Company), 11-18 (Individual)
--     -- Actually, Identity sequence for Jobs depends on insert order.
--     -- Jobs 1-10 were inserted first (Companies), Jobs 11-18 inserted second (Individuals).
--     -- BUT Wait, I inserted 10 company jobs first, then 8 individual jobs.
--     -- Job 1-10: Corporate. Job 11-18: Individual.
--     INSERT INTO [dbo].[APPLY] (ID, JobID, Status) VALUES
--     (1, 1, N'Chờ duyệt'), (2, 3, N'Đã nhận'), (3, 11, N'Chờ duyệt'), 
--     (4, 11, N'Từ chối'), (5, 5, N'Chờ duyệt'),
--     (6, 6, N'Chờ duyệt'), -- Cand6 -> NashTech (.NET) - Mismatch but applying
--     (6, 7, N'Đã nhận'),   -- Cand6 -> Samsung (Mobile QA) - Match!
--     (7, 7, N'Từ chối'),   -- Cand7 -> Samsung
--     (8, 17, N'Chờ duyệt'); -- Cand8 -> SEO

--     -- =========================================================
--     -- 10. MESSAGES
--     -- =========================================================
--     INSERT INTO [dbo].[MESSAGE] (SenderID, ReceiverID, Content) VALUES
--     (1, 17, N'Đã gửi CV'), (17, 1, N'Received'), 
--     (9, 3, N'Em đi làm được không?'), (3, 9, N'Dạ được'), 
--     (21, 5, N'Mời phỏng vấn'),
--     (6, 23, N'Em có kinh nghiệm Flutter'), (23, 6, N'Mời bạn PV');

--     -- =========================================================
--     -- 11. SENDMSG
--     -- =========================================================
--     INSERT INTO [dbo].[SENDMSG] (SenderID, ReceiverID) VALUES 
--     (1, 17), (17, 1), (9, 3), (3, 9), (21, 5), (6, 23), (23, 6);

--     -- =========================================================
--     -- 12. FOLLOW
--     -- =========================================================
--     INSERT INTO [dbo].[FOLLOW] (EmployerID, CandidateID) VALUES 
--     (17, 1), (18, 2), (9, 3), (10, 4), (21, 5), (22, 1), (23, 6), (14, 6);

--     -- =========================================================
--     -- 13. NOTIFY
--     -- =========================================================
--     INSERT INTO [dbo].[NOTIFY] (CandidateID, JobID, EmployerID, Content) VALUES
--     (1, 1, 17, N'Viewed'), (2, 3, 19, N'Accepted'), (3, 11, 9, N'Invite'), 
--     (4, 11, 10, N'Rejected'), (5, 5, 21, N'Interview');

--     -- =========================================================
--     -- 14. OWN (Candidate Skills)
--     -- =========================================================
--     INSERT INTO [dbo].[OWN] (ID, SkillID) VALUES 
--     (1, 1), (2, 3), (3, 2), (4, 4), (5, 6), (6, 10), (7, 11), (8, 12);

--     -- =========================================================
--     -- 15. REQUIRE (Job Skills)
--     -- =========================================================
--     -- Mapping Skills to Jobs:
--     -- Job 1 (Java Dev) needs Java(1)
--     -- Job 7 (Mobile QA) needs Flutter(10)
--     -- Job 16 (Gym) needs Gym(13)
--     INSERT INTO [dbo].[REQUIRE] (SkillID, JobID) VALUES 
--     (1, 1), (2, 11), (3, 3), (1, 2), (6, 5), 
--     (15, 6), (10, 7), (5, 7), (13, 16), (12, 17), (5, 1), (5, 2), (5, 3);

--     -- =========================================================
--     -- 16. IN (Job Categories)
--     -- =========================================================
--     INSERT INTO [dbo].[IN] (JCName, JobID) VALUES 
--     (N'Công nghệ thông tin', 1), (N'Dịch vụ', 11), (N'Bán lẻ', 3), 
--     (N'Công nghệ thông tin', 2), (N'Bán lẻ', 5),
--     (N'Công nghệ thông tin', 6), (N'Công nghệ thông tin', 7),
--     (N'Sức khỏe', 16), (N'Du lịch', 18);


--     -- =========================================================
--     -- 17. RELATE
--     -- =========================================================
--     INSERT INTO [dbo].[RELATE] (VJobID, RJobID) VALUES 
--     (1, 2), (6, 7), (11, 13);

--     -- =========================================================
--     -- 18. FEEDBACK
--     -- =========================================================
--     INSERT INTO [dbo].[FEEDBACK] (ID, JobID, Content, [Rank]) VALUES
--     (1, 1, N'Good', 5), (2, 3, N'Okay', 4), (3, 11, N'Friendly', 5), 
--     (4, 11, N'Bad', 1), (5, 5, N'Professional', 5),
--     (6, 7, N'Professional Environment', 5);

--     COMMIT TRANSACTION;
--     PRINT 'SUCCESS: Full Database Created and Populated.';
-- END TRY
-- BEGIN CATCH
--     ROLLBACK TRANSACTION;
--     PRINT 'ERROR: ' + ERROR_MESSAGE();
-- END CATCH
-- GO