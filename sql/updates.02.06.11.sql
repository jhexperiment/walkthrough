CREATE  TABLE IF NOT EXISTS `maili.elem.db`.`WalkthroughCounters` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `label` VARCHAR(128) NOT NULL ,
  `val` INT NULL DEFAULT NULL ,
  `Walkthroughs_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_WalkthroughCounters_Walkthroughs1` (`Walkthroughs_id` ASC) ,
  CONSTRAINT `fk_WalkthroughCounters_Walkthroughs1`
    FOREIGN KEY (`Walkthroughs_id` )
    REFERENCES `maili.elem.db`.`Walkthroughs` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO WalkthroughCounters (label, val, Walkthroughs_id)
	SELECT 'Choral Response', w.choral_response, w.id
	FROM Walkthroughs AS w;

INSERT INTO WalkthroughCounters (label, val, Walkthroughs_id)
	SELECT 'BuddyBuzz', w.buddybuzz, w.id
	FROM Walkthroughs AS w;

INSERT INTO WalkthroughCounters (label, val, Walkthroughs_id)
	SELECT 'Call Outs', w.call_outs, w.id
	FROM Walkthroughs AS w;

ALTER TABLE `Walkthroughs`
  DROP `choral_response`,
  DROP `buddybuzz`,
  DROP `call_outs`;

