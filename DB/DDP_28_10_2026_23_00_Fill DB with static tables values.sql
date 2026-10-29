/*
    Dino Predictor: Added Dinosaurs static types
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;

MERGE dbo.DinoTypes AS target
USING (
    VALUES
        (1, 'Allosaurus'),
        (2, 'Camarasaurus'),
        (3, 'Camptosaurus'),
        (4, 'Deinonychus'),
        (5, 'Edmontosaurus'),
        (6, 'Monoclonius'),
        (7, 'Stegosaurus'),
        (8, 'Torosaurus'),
        (9, 'Triceratops')
) AS source (Id, Code)
    ON target.Id = source.Id
WHEN MATCHED AND target.Code <> source.Code THEN
    UPDATE SET Code = source.Code
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Id, Code) VALUES (source.Id, source.Code);

MERGE dbo.DinoTypeTranslations AS target
USING (
    VALUES
        (1, 'en', N'Allosaurus'),
        (2, 'en', N'Camarasaurus'),
        (3, 'en', N'Camptosaurus'),
        (4, 'en', N'Deinonychus'),
        (5, 'en', N'Edmontosaurus'),
        (6, 'en', N'Monoclonius'),
        (7, 'en', N'Stegosaurus'),
        (8, 'en', N'Torosaurus'),
        (9, 'en', N'Triceratops'),
        (1, 'uk', N'Аллозавр'),
        (2, 'uk', N'Камаразавр'),
        (3, 'uk', N'Камптозавр'),
        (4, 'uk', N'Дейноніх'),
        (5, 'uk', N'Едмонтозавр'),
        (6, 'uk', N'Моноклоній'),
        (7, 'uk', N'Стегозавр'),
        (8, 'uk', N'Торозавр'),
        (9, 'uk', N'Трицератопс')
) AS source (DinoTypeId, Culture, Name)
    ON target.DinoTypeId = source.DinoTypeId AND target.Culture = source.Culture
WHEN MATCHED AND target.Name <> source.Name THEN
    UPDATE SET Name = source.Name
WHEN NOT MATCHED BY TARGET THEN
    INSERT (DinoTypeId, Culture, Name) VALUES (source.DinoTypeId, source.Culture, source.Name);

COMMIT TRANSACTION;
