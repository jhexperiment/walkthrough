
INSERT INTO `maili.elem.db`.`WalkthroughThinkingMaps` (`name`)
VALUES
('Circle'),
('Bubble'),
('DoubleBubble'),
('Tree'),
('Flow'),
('Cause & Effect'),
('Brace'),
('Analogy');

INSERT INTO `maili.elem.db`.`WalkthroughSubjects` (`name`)
VALUES
('Reading'),
('Math'),
('Home Room');


INSERT INTO `WalkthroughOptionLists` (`id`, `label`) VALUES
(1, 'BERC Teacher'),
(2, 'BERC Student');

INSERT INTO `WalkthroughOptionListOptions` (`id`, `WalkthroughOptionLists_id`, `name`) VALUES
(1, 1, 'Asks opinions'),
(2, 1, 'Gives wait time'),
(3, 1, 'Asks open-ened ?s'),
(4, 1, 'Probes past correct'),
(5, 1, 'Asks higher order ?s'),
(6, 1, 'Elicits multiple answers'),
(7, 2, 'Explains, justifies'),
(8, 2, 'Gives peer feedback'),
(9, 2, 'Metacognition'),
(10, 2, 'Revises own thinking'),
(11, 2, 'Reflects in writing'),
(12, 2, 'Revises work');

