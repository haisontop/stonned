export type AllStaking = {
  "version": "0.0.0",
  "name": "all_staking",
  "instructions": [
    {
      "name": "initProgram",
      "accounts": [
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
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
          "name": "puffToken",
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
          "name": "programPuffTokenAccountBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startStaking",
      "accounts": [
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
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
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
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
          "name": "stakeAccountBump",
          "type": "u8"
        },
        {
          "name": "vaultTokenAccountBump",
          "type": "u8"
        },
        {
          "name": "authority",
          "type": "publicKey"
        },
        {
          "name": "token",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
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
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "puffToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "programPuffTokenAccountBump",
          "type": "u8"
        },
        {
          "name": "amountPerDay",
          "type": "u32"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
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
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "puffToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "programPuffTokenAccountBump",
          "type": "u8"
        },
        {
          "name": "amountPerDay",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "stakeAccount",
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
            "name": "startStaking",
            "type": "i64"
          },
          {
            "name": "lastWithdraw",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vaultTokenAccountBump",
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
      "code": 300,
      "name": "WrongMint",
      "msg": "NFT must be from stoned ape crew"
    }
  ]
};

export const IDL: AllStaking = {
  "version": "0.0.0",
  "name": "all_staking",
  "instructions": [
    {
      "name": "initProgram",
      "accounts": [
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
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
          "name": "puffToken",
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
          "name": "programPuffTokenAccountBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startStaking",
      "accounts": [
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
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
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
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
          "name": "stakeAccountBump",
          "type": "u8"
        },
        {
          "name": "vaultTokenAccountBump",
          "type": "u8"
        },
        {
          "name": "authority",
          "type": "publicKey"
        },
        {
          "name": "token",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
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
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "puffToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "programPuffTokenAccountBump",
          "type": "u8"
        },
        {
          "name": "amountPerDay",
          "type": "u32"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
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
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "puffToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPuffTokenAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "programPuffTokenAccountBump",
          "type": "u8"
        },
        {
          "name": "amountPerDay",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "stakeAccount",
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
            "name": "startStaking",
            "type": "i64"
          },
          {
            "name": "lastWithdraw",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vaultTokenAccountBump",
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
      "code": 300,
      "name": "WrongMint",
      "msg": "NFT must be from stoned ape crew"
    }
  ]
};
