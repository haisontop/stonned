export type Auctions = {
  "version": "0.1.0",
  "name": "auctions",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initAuction",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bidToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeToken",
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "starts",
          "type": "i64"
        },
        {
          "name": "ends",
          "type": "i64"
        },
        {
          "name": "prizeMint",
          "type": "publicKey"
        },
        {
          "name": "isBidTokenSol",
          "type": "bool"
        },
        {
          "name": "bidToken",
          "type": "publicKey"
        },
        {
          "name": "mintValue",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "string"
        },
        {
          "name": "minBidIncrease",
          "type": "u64"
        },
        {
          "name": "startBid",
          "type": "u64"
        },
        {
          "name": "finishExtensionTimeSec",
          "type": "u64"
        }
      ]
    },
    {
      "name": "bid",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lastBidTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bidToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
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
          "name": "bidAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPrizeTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "auction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "fundsUser",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "starts",
            "type": "i64"
          },
          {
            "name": "ends",
            "type": "i64"
          },
          {
            "name": "prizeMint",
            "type": "publicKey"
          },
          {
            "name": "bidToken",
            "type": "publicKey"
          },
          {
            "name": "isBidTokenSol",
            "type": "bool"
          },
          {
            "name": "mintValue",
            "type": "u64"
          },
          {
            "name": "prizeSent",
            "type": "bool"
          },
          {
            "name": "bids",
            "type": {
              "vec": {
                "defined": "BidEntry"
              }
            }
          },
          {
            "name": "currency",
            "type": "string"
          },
          {
            "name": "minBidIncrease",
            "type": "u64"
          },
          {
            "name": "finishExtensionTimeSec",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BidEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidCheckNonce",
      "msg": "The bid must be bigger than the current one"
    },
    {
      "code": 6001,
      "name": "WrongTokenAccount",
      "msg": "You sent the wrong token account"
    },
    {
      "code": 6002,
      "name": "AuctionEnded",
      "msg": "Auction already ended"
    },
    {
      "code": 6003,
      "name": "AuctionNotEnded",
      "msg": "Auction not ended yet"
    },
    {
      "code": 6004,
      "name": "PriceAlreadyClaimed",
      "msg": "Prize already claimed"
    }
  ]
};

export const IDL: Auctions = {
  "version": "0.1.0",
  "name": "auctions",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initAuction",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bidToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeToken",
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "starts",
          "type": "i64"
        },
        {
          "name": "ends",
          "type": "i64"
        },
        {
          "name": "prizeMint",
          "type": "publicKey"
        },
        {
          "name": "isBidTokenSol",
          "type": "bool"
        },
        {
          "name": "bidToken",
          "type": "publicKey"
        },
        {
          "name": "mintValue",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "string"
        },
        {
          "name": "minBidIncrease",
          "type": "u64"
        },
        {
          "name": "startBid",
          "type": "u64"
        },
        {
          "name": "finishExtensionTimeSec",
          "type": "u64"
        }
      ]
    },
    {
      "name": "bid",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lastBidTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bidToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
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
          "name": "bidAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPrizeTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "auction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "fundsUser",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "starts",
            "type": "i64"
          },
          {
            "name": "ends",
            "type": "i64"
          },
          {
            "name": "prizeMint",
            "type": "publicKey"
          },
          {
            "name": "bidToken",
            "type": "publicKey"
          },
          {
            "name": "isBidTokenSol",
            "type": "bool"
          },
          {
            "name": "mintValue",
            "type": "u64"
          },
          {
            "name": "prizeSent",
            "type": "bool"
          },
          {
            "name": "bids",
            "type": {
              "vec": {
                "defined": "BidEntry"
              }
            }
          },
          {
            "name": "currency",
            "type": "string"
          },
          {
            "name": "minBidIncrease",
            "type": "u64"
          },
          {
            "name": "finishExtensionTimeSec",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BidEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidCheckNonce",
      "msg": "The bid must be bigger than the current one"
    },
    {
      "code": 6001,
      "name": "WrongTokenAccount",
      "msg": "You sent the wrong token account"
    },
    {
      "code": 6002,
      "name": "AuctionEnded",
      "msg": "Auction already ended"
    },
    {
      "code": 6003,
      "name": "AuctionNotEnded",
      "msg": "Auction not ended yet"
    },
    {
      "code": 6004,
      "name": "PriceAlreadyClaimed",
      "msg": "Prize already claimed"
    }
  ]
};
