export type HeislMachine = {
  "version": "0.1.0",
  "name": "heisl_machine",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initLaunch",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "launchMints",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "identifier",
          "type": "string"
        },
        {
          "name": "nftCount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "resetLaunch",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "launchMints",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "identifier",
          "type": "string"
        },
        {
          "name": "nftCount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launch",
          "isMut": true,
          "isSigner": false
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
      "name": "mint",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launchMints",
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
        }
      ],
      "args": [
        {
          "name": "mintId",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "launch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "nftCount",
            "type": "u32"
          },
          {
            "name": "alreadyMintedOld",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "launchMints",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "launchMints",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "counter",
            "type": "u16"
          },
          {
            "name": "alreadyMinted",
            "type": {
              "array": [
                "u16",
                21000
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitLaunch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftCount",
            "type": "u32"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyMinted",
      "msg": "There was an error at the mint. Please try again."
    },
    {
      "code": 6001,
      "name": "MintNotAvailable",
      "msg": "This mint is not available."
    },
    {
      "code": 6002,
      "name": "NotAuthorized",
      "msg": "You are not auhtorized"
    }
  ]
};

export const IDL: HeislMachine = {
  "version": "0.1.0",
  "name": "heisl_machine",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initLaunch",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "launchMints",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "identifier",
          "type": "string"
        },
        {
          "name": "nftCount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "resetLaunch",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "launchMints",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "identifier",
          "type": "string"
        },
        {
          "name": "nftCount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launch",
          "isMut": true,
          "isSigner": false
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
      "name": "mint",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launchMints",
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
        }
      ],
      "args": [
        {
          "name": "mintId",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "launch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "identifier",
            "type": "string"
          },
          {
            "name": "nftCount",
            "type": "u32"
          },
          {
            "name": "alreadyMintedOld",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "launchMints",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "launchMints",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "counter",
            "type": "u16"
          },
          {
            "name": "alreadyMinted",
            "type": {
              "array": [
                "u16",
                21000
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitLaunch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftCount",
            "type": "u32"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyMinted",
      "msg": "There was an error at the mint. Please try again."
    },
    {
      "code": 6001,
      "name": "MintNotAvailable",
      "msg": "This mint is not available."
    },
    {
      "code": 6002,
      "name": "NotAuthorized",
      "msg": "You are not auhtorized"
    }
  ]
};
