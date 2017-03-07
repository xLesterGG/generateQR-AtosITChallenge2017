CREATE DATABASE atos;

USE atos;

CREATE TABLE nxtAccounts(
    nxtAccountNumber VARCHAR(30) NOT NULL,
    numberOfBatches int NOT NULL,
    secretPhrase VARCHAR(100) NOT NULL,
    PRIMARY KEY(nxtAccountNumber)
)