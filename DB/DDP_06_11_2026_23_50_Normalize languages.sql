/*
    Dino Predictor: languages dictionary

      - dbo.Languages keeps the supported languages;
      - dbo.DinoTypeTranslations references a language by LanguageId instead of the old free-text Culture column;
      - the dino names are static seed data, so the table is recreated and filled again;
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF OBJECT_ID(N'dbo.Languages', N'U') IS NULL
    CREATE TABLE dbo.Languages (
        Id TINYINT NOT NULL,
        Code VARCHAR(10) NOT NULL,
        Name NVARCHAR(50) NOT NULL,
        CONSTRAINT PK_Languages PRIMARY KEY (Id),
        CONSTRAINT UQ_Languages_Code UNIQUE (Code)
    );

MERGE dbo.Languages AS target
USING (
    VALUES
    (1, 'uk', N'Українська'),
    (2, 'en', N'English')
) AS source(Id, Code, Name)
    ON target.Id = source.Id
WHEN MATCHED AND (target.Code <> source.Code OR target.Name <> source.Name)
    THEN
    UPDATE SET
        Code = source.Code,
        Name = source.Name
WHEN NOT MATCHED BY TARGET
    THEN
    INSERT (Id, Code, Name) VALUES (source.Id, source.Code, source.Name);

IF COL_LENGTH(N'dbo.DinoTypeTranslations', N'Culture') IS NOT NULL
    DROP TABLE dbo.DinoTypeTranslations;

IF OBJECT_ID(N'dbo.DinoTypeTranslations', N'U') IS NULL
    CREATE TABLE dbo.DinoTypeTranslations (
        DinoTypeId TINYINT NOT NULL,
        LanguageId TINYINT NOT NULL,
        Name NVARCHAR(100) NOT NULL,
        CONSTRAINT PK_DinoTypeTranslations PRIMARY KEY (DinoTypeId, LanguageId),
        CONSTRAINT FK_DinoTypeTranslations_DinoTypes FOREIGN KEY (DinoTypeId)
        REFERENCES dbo.DinoTypes (Id),
        CONSTRAINT FK_DinoTypeTranslations_Languages FOREIGN KEY (LanguageId)
        REFERENCES dbo.Languages (Id)
    );

GO

MERGE dbo.DinoTypeTranslations AS target
USING (
    VALUES
    (1, 1, N'Аллозавр'),
    (2, 1, N'Камаразавр'),
    (3, 1, N'Камптозавр'),
    (4, 1, N'Дейноніх'),
    (5, 1, N'Едмонтозавр'),
    (6, 1, N'Моноклоній'),
    (7, 1, N'Стегозавр'),
    (8, 1, N'Торозавр'),
    (9, 1, N'Трицератопс'),
    (1, 2, N'Allosaurus'),
    (2, 2, N'Camarasaurus'),
    (3, 2, N'Camptosaurus'),
    (4, 2, N'Deinonychus'),
    (5, 2, N'Edmontosaurus'),
    (6, 2, N'Monoclonius'),
    (7, 2, N'Stegosaurus'),
    (8, 2, N'Torosaurus'),
    (9, 2, N'Triceratops')
) AS source(DinoTypeId, LanguageId, Name)
    ON target.DinoTypeId = source.DinoTypeId AND target.LanguageId = source.LanguageId
WHEN MATCHED AND target.Name <> source.Name
    THEN
    UPDATE SET Name = source.Name
WHEN NOT MATCHED BY TARGET
    THEN
    INSERT (DinoTypeId, LanguageId, Name) VALUES (source.DinoTypeId, source.LanguageId, source.Name);

COMMIT TRANSACTION;
