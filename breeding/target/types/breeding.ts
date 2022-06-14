export type Breeding = {
  "version": "0.1.0",
  "name": "breeding",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initBreeding",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "configAccountBump",
          "type": "u8"
        },
        {
          "name": "candyMachine",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "startBreeding",
      "accounts": [
        {
          "name": "breedingAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Used",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Used",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "puffToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ape1VaultBump",
          "type": "u8"
        },
        {
          "name": "ape1UsedBump",
          "type": "u8"
        },
        {
          "name": "ape2VaultBump",
          "type": "u8"
        },
        {
          "name": "ape2UsedBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startBreedingRental",
      "accounts": [
        {
          "name": "breedingAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rentalUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Used",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rentAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Used",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "puffToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rentalFeeDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ape1VaultBump",
          "type": "u8"
        },
        {
          "name": "ape1UsedBump",
          "type": "u8"
        },
        {
          "name": "ape2UsedBump",
          "type": "u8"
        },
        {
          "name": "rentingRole",
          "type": "u8"
        }
      ]
    },
    {
      "name": "reveal",
      "accounts": [
        {
          "name": "breedingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ape1VaultBump",
          "type": "u8"
        },
        {
          "name": "ape2VaultBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "breed",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendUser",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "candyMachineProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachineCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recentBlockhashes",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructionSysvarAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creatorBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startRent",
      "accounts": [
        {
          "name": "rentAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeUserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "apeVaultBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "unrent",
      "accounts": [
        {
          "name": "rentAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeUserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "apeVaultBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "configAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "counter",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "candyMachine",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "apeUsed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "breedingConfig",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "counter",
            "type": "u16"
          },
          {
            "name": "lastUseStart",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "basicAccount",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "rentAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "breedingConfig",
            "type": "publicKey"
          },
          {
            "name": "startRenting",
            "type": "i64"
          },
          {
            "name": "ape",
            "type": "publicKey"
          },
          {
            "name": "vaultApeAccountBump",
            "type": "u8"
          },
          {
            "name": "isBreeding",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "breedingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "breedingConfig",
            "type": "publicKey"
          },
          {
            "name": "startBreeding",
            "type": "i64"
          },
          {
            "name": "ape1",
            "type": "publicKey"
          },
          {
            "name": "ape2",
            "type": "publicKey"
          },
          {
            "name": "vaultNftAccountBump",
            "type": "u8"
          },
          {
            "name": "rentalUser",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "finished",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Role",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Chimpion"
          },
          {
            "name": "FourRoles"
          },
          {
            "name": "Sealz"
          },
          {
            "name": "OneOutOfOne"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "WrongMint",
      "msg": "ApeUsed account has wrong mint"
    },
    {
      "code": 6001,
      "name": "ToEarly",
      "msg": "You can't reveal now, your Ape is still on retreat"
    },
    {
      "code": 6002,
      "name": "CoolDown",
      "msg": "Your hasn't cooled down for 7 days"
    },
    {
      "code": 6003,
      "name": "WrongApe2TokenAccount",
      "msg": "Wrong ape2 token account"
    },
    {
      "code": 6004,
      "name": "Unexpected",
      "msg": "Unexpected error"
    }
  ]
};

export const IDL: Breeding = {
  "version": "0.1.0",
  "name": "breeding",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initBreeding",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "configAccountBump",
          "type": "u8"
        },
        {
          "name": "candyMachine",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "startBreeding",
      "accounts": [
        {
          "name": "breedingAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Used",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Used",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "puffToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ape1VaultBump",
          "type": "u8"
        },
        {
          "name": "ape1UsedBump",
          "type": "u8"
        },
        {
          "name": "ape2VaultBump",
          "type": "u8"
        },
        {
          "name": "ape2UsedBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startBreedingRental",
      "accounts": [
        {
          "name": "breedingAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rentalUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Used",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rentAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Used",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "puffToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rentalFeeDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ape1VaultBump",
          "type": "u8"
        },
        {
          "name": "ape1UsedBump",
          "type": "u8"
        },
        {
          "name": "ape2UsedBump",
          "type": "u8"
        },
        {
          "name": "rentingRole",
          "type": "u8"
        }
      ]
    },
    {
      "name": "reveal",
      "accounts": [
        {
          "name": "breedingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape1UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2Vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ape2UserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ape1VaultBump",
          "type": "u8"
        },
        {
          "name": "ape2VaultBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "breed",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendUser",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "candyMachineProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachineCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recentBlockhashes",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructionSysvarAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creatorBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startRent",
      "accounts": [
        {
          "name": "rentAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeUserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "apeVaultBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "unrent",
      "accounts": [
        {
          "name": "rentAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeUserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "apeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "apeVaultBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "configAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "counter",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "candyMachine",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "apeUsed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "breedingConfig",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "counter",
            "type": "u16"
          },
          {
            "name": "lastUseStart",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "basicAccount",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "rentAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "breedingConfig",
            "type": "publicKey"
          },
          {
            "name": "startRenting",
            "type": "i64"
          },
          {
            "name": "ape",
            "type": "publicKey"
          },
          {
            "name": "vaultApeAccountBump",
            "type": "u8"
          },
          {
            "name": "isBreeding",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "breedingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "breedingConfig",
            "type": "publicKey"
          },
          {
            "name": "startBreeding",
            "type": "i64"
          },
          {
            "name": "ape1",
            "type": "publicKey"
          },
          {
            "name": "ape2",
            "type": "publicKey"
          },
          {
            "name": "vaultNftAccountBump",
            "type": "u8"
          },
          {
            "name": "rentalUser",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "finished",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Role",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Chimpion"
          },
          {
            "name": "FourRoles"
          },
          {
            "name": "Sealz"
          },
          {
            "name": "OneOutOfOne"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "WrongMint",
      "msg": "ApeUsed account has wrong mint"
    },
    {
      "code": 6001,
      "name": "ToEarly",
      "msg": "You can't reveal now, your Ape is still on retreat"
    },
    {
      "code": 6002,
      "name": "CoolDown",
      "msg": "Your hasn't cooled down for 7 days"
    },
    {
      "code": 6003,
      "name": "WrongApe2TokenAccount",
      "msg": "Wrong ape2 token account"
    },
    {
      "code": 6004,
      "name": "Unexpected",
      "msg": "Unexpected error"
    }
  ]
};
