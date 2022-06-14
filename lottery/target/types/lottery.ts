export type Lottery = {
  "version": "0.0.0",
  "name": "lottery",
  "instructions": [
    {
      "name": "initLottery",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lottery",
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
          "name": "lotteryBump",
          "type": "u8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "ticketPrice",
          "type": "u64"
        },
        {
          "name": "prices",
          "type": {
            "vec": {
              "defined": "Price"
            }
          }
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
          "name": "totalPriceSol",
          "type": "u64"
        },
        {
          "name": "payTokens",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "addPrices",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lottery",
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
          "name": "prices",
          "type": {
            "vec": {
              "defined": "Price"
            }
          }
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fundsUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fundsTokenAccount",
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
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "userLotteryBump",
          "type": "u8"
        },
        {
          "name": "ticketCount",
          "type": "u32"
        },
        {
          "name": "payWithSol",
          "type": "bool"
        },
        {
          "name": "splPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "raffle",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "winningTickets",
          "type": {
            "vec": "u32"
          }
        },
        {
          "name": "winners",
          "type": {
            "vec": "publicKey"
          }
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
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pricesTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "priceWalletSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
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
          "name": "ticket",
          "type": "u32"
        }
      ]
    },
    {
      "name": "close",
      "accounts": [
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
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "pricesVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lottery",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "lottery",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "ticketCount",
            "type": "u32"
          },
          {
            "name": "fundsUser",
            "type": "publicKey"
          },
          {
            "name": "fundsTokenAccount",
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
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "payTokens",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "winningTickets",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "winners",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": "Price"
              }
            }
          },
          {
            "name": "totalPriceSol",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lotteryUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "lottery",
            "type": "publicKey"
          },
          {
            "name": "counter",
            "type": "u32"
          },
          {
            "name": "tickets",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Price",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u32"
          },
          {
            "name": "winningTicket",
            "type": "u32"
          },
          {
            "name": "priceSent",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "InvalidPayTokenAccount",
      "msg": "The given pay token account is wrong."
    },
    {
      "code": 301,
      "name": "LotteryPayWindowOver",
      "msg": "You cant buy any tickets for this lottery anymore."
    },
    {
      "code": 302,
      "name": "WrongMint",
      "msg": "You passed the wrong mint."
    },
    {
      "code": 303,
      "name": "PriceAlreadyClaimed",
      "msg": "Price already claimed."
    },
    {
      "code": 304,
      "name": "WrongTicket",
      "msg": "You don't own this ticket."
    },
    {
      "code": 305,
      "name": "MaximumTicketCount",
      "msg": "You can buy a maximum of 100 tickets"
    }
  ]
};

export const IDL: Lottery = {
  "version": "0.0.0",
  "name": "lottery",
  "instructions": [
    {
      "name": "initLottery",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lottery",
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
          "name": "lotteryBump",
          "type": "u8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "ticketPrice",
          "type": "u64"
        },
        {
          "name": "prices",
          "type": {
            "vec": {
              "defined": "Price"
            }
          }
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
          "name": "totalPriceSol",
          "type": "u64"
        },
        {
          "name": "payTokens",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "addPrices",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lottery",
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
          "name": "prices",
          "type": {
            "vec": {
              "defined": "Price"
            }
          }
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fundsUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fundsTokenAccount",
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
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "userLotteryBump",
          "type": "u8"
        },
        {
          "name": "ticketCount",
          "type": "u32"
        },
        {
          "name": "payWithSol",
          "type": "bool"
        },
        {
          "name": "splPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "raffle",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "winningTickets",
          "type": {
            "vec": "u32"
          }
        },
        {
          "name": "winners",
          "type": {
            "vec": "publicKey"
          }
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
          "name": "backendUser",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lotteryUser",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pricesTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "priceWalletSigner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
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
          "name": "ticket",
          "type": "u32"
        }
      ]
    },
    {
      "name": "close",
      "accounts": [
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
          "name": "lottery",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "pricesVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lottery",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "lottery",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "ticketCount",
            "type": "u32"
          },
          {
            "name": "fundsUser",
            "type": "publicKey"
          },
          {
            "name": "fundsTokenAccount",
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
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "payTokens",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "winningTickets",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "winners",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": "Price"
              }
            }
          },
          {
            "name": "totalPriceSol",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lotteryUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "lottery",
            "type": "publicKey"
          },
          {
            "name": "counter",
            "type": "u32"
          },
          {
            "name": "tickets",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Price",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u32"
          },
          {
            "name": "winningTicket",
            "type": "u32"
          },
          {
            "name": "priceSent",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "InvalidPayTokenAccount",
      "msg": "The given pay token account is wrong."
    },
    {
      "code": 301,
      "name": "LotteryPayWindowOver",
      "msg": "You cant buy any tickets for this lottery anymore."
    },
    {
      "code": 302,
      "name": "WrongMint",
      "msg": "You passed the wrong mint."
    },
    {
      "code": 303,
      "name": "PriceAlreadyClaimed",
      "msg": "Price already claimed."
    },
    {
      "code": 304,
      "name": "WrongTicket",
      "msg": "You don't own this ticket."
    },
    {
      "code": 305,
      "name": "MaximumTicketCount",
      "msg": "You can buy a maximum of 100 tickets"
    }
  ]
};
