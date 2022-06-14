export type Evolution = {
  "version": "0.0.0",
  "name": "evolution",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addMetadata",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": "string"
        }
      ]
    },
    {
      "name": "startEvolution",
      "accounts": [
        {
          "name": "evolutionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
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
          "name": "puffToken",
          "isMut": false,
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
          "name": "evolutionAccountBump",
          "type": "u8"
        },
        {
          "name": "vaultNftAccountBump",
          "type": "u8"
        },
        {
          "name": "isDmt",
          "type": "bool"
        },
        {
          "name": "isAyahuasca",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateEvolution",
      "accounts": [
        {
          "name": "evolutionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
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
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "evolutionAccountBump",
          "type": "u8"
        },
        {
          "name": "newConfig",
          "type": "string"
        },
        {
          "name": "newRole",
          "type": "string"
        }
      ]
    },
    {
      "name": "reveal",
      "accounts": [
        {
          "name": "evolutionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
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
          "name": "userNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataUpdateAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "metadataProgram",
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
          "name": "evolutionAccountBump",
          "type": "u8"
        },
        {
          "name": "vaultNftAccountBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "programConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "puffTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "evolutionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "startEvolution",
            "type": "i64"
          },
          {
            "name": "newRole",
            "type": "string"
          },
          {
            "name": "newMetadata",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vaultNftAccountBump",
            "type": "u8"
          },
          {
            "name": "isDmt",
            "type": "bool"
          },
          {
            "name": "isAyahuasca",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "EvolutionStarted",
      "fields": [
        {
          "name": "mint",
          "type": "string",
          "index": false
        },
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "evolutionAccountBump",
          "type": "u8",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "WrongMint",
      "msg": "NFT must be from Stoned Ape Crew & of role Chimpion"
    },
    {
      "code": 301,
      "name": "ToEarly",
      "msg": "You can't reveal now, your Ape is still on retreat"
    },
    {
      "code": 302,
      "name": "Unexpected",
      "msg": "Unexpected error"
    }
  ]
};

export const IDL: Evolution = {
  "version": "0.0.0",
  "name": "evolution",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addMetadata",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": "string"
        }
      ]
    },
    {
      "name": "startEvolution",
      "accounts": [
        {
          "name": "evolutionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "vaultNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
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
          "name": "puffToken",
          "isMut": false,
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
          "name": "evolutionAccountBump",
          "type": "u8"
        },
        {
          "name": "vaultNftAccountBump",
          "type": "u8"
        },
        {
          "name": "isDmt",
          "type": "bool"
        },
        {
          "name": "isAyahuasca",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateEvolution",
      "accounts": [
        {
          "name": "evolutionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
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
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "evolutionAccountBump",
          "type": "u8"
        },
        {
          "name": "newConfig",
          "type": "string"
        },
        {
          "name": "newRole",
          "type": "string"
        }
      ]
    },
    {
      "name": "reveal",
      "accounts": [
        {
          "name": "evolutionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
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
          "name": "userNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataUpdateAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "metadataProgram",
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
          "name": "evolutionAccountBump",
          "type": "u8"
        },
        {
          "name": "vaultNftAccountBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "programConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "puffTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "evolutionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "startEvolution",
            "type": "i64"
          },
          {
            "name": "newRole",
            "type": "string"
          },
          {
            "name": "newMetadata",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vaultNftAccountBump",
            "type": "u8"
          },
          {
            "name": "isDmt",
            "type": "bool"
          },
          {
            "name": "isAyahuasca",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "EvolutionStarted",
      "fields": [
        {
          "name": "mint",
          "type": "string",
          "index": false
        },
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "evolutionAccountBump",
          "type": "u8",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "WrongMint",
      "msg": "NFT must be from Stoned Ape Crew & of role Chimpion"
    },
    {
      "code": 301,
      "name": "ToEarly",
      "msg": "You can't reveal now, your Ape is still on retreat"
    },
    {
      "code": 302,
      "name": "Unexpected",
      "msg": "Unexpected error"
    }
  ]
};
