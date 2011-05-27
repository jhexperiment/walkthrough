CREATE  TABLE IF NOT EXISTS `maili.elem.db`.`WalkthroughTimers` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `label` VARCHAR(255) NOT NULL ,
  `seconds` INT NOT NULL DEFAULT 0 ,
  `Walkthroughs_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_WalkthroughTimers_Walkthroughs1` (`Walkthroughs_id` ASC) ,
  CONSTRAINT `fk_WalkthroughTimers_Walkthroughs1`
    FOREIGN KEY (`Walkthroughs_id` )
    REFERENCES `maili.elem.db`.`Walkthroughs` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

