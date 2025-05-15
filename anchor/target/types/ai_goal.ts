/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ai_goal.json`.
 */
export type AiGoal = {
  "address": "95nsq6ehWVpJqMxL5wznvNGXMd8NN8MQGnenZ7DUGZfU",
  "metadata": {
    "name": "aiGoal",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "completeGoal",
      "discriminator": [
        140,
        54,
        173,
        125,
        210,
        162,
        67,
        228
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "goalManager",
          "writable": true
        },
        {
          "name": "goal",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "goalId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "confirmWitness",
      "discriminator": [
        166,
        239,
        181,
        0,
        91,
        72,
        39,
        207
      ],
      "accounts": [
        {
          "name": "witness",
          "writable": true,
          "signer": true
        },
        {
          "name": "goal",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "goalId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createAgent",
      "discriminator": [
        143,
        66,
        198,
        95,
        110,
        85,
        83,
        249
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "goal",
          "writable": true
        },
        {
          "name": "agent",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  103,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "goal.goal_id",
                "account": "goalInfo"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "agentId",
          "type": "string"
        },
        {
          "name": "agentName",
          "type": "string"
        },
        {
          "name": "charactorJson",
          "type": "string"
        }
      ]
    },
    {
      "name": "createComment",
      "discriminator": [
        236,
        232,
        11,
        180,
        70,
        206,
        73,
        145
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "goal",
          "writable": true
        },
        {
          "name": "comment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "goal.goal_id",
                "account": "goalInfo"
              },
              {
                "kind": "account",
                "path": "goal.comment_counter",
                "account": "goalInfo"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "goalId",
          "type": "u64"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "createGoal",
      "discriminator": [
        229,
        63,
        42,
        239,
        1,
        226,
        219,
        196
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "goalManager",
          "writable": true
        },
        {
          "name": "goal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "goal_manager.goal_count",
                "account": "goalManagerInfo"
              }
            ]
          }
        },
        {
          "name": "userGoals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  103,
                  111,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "aiSuggestion",
          "type": "string"
        },
        {
          "name": "deadline",
          "type": "u64"
        },
        {
          "name": "witnesses",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "failGoal",
      "discriminator": [
        250,
        166,
        193,
        14,
        200,
        9,
        119,
        3
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "goalManager",
          "writable": true
        },
        {
          "name": "goal",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "goalId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initWitnessGoalData",
      "discriminator": [
        247,
        196,
        146,
        168,
        156,
        11,
        43,
        59
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "goal"
          ]
        },
        {
          "name": "goal",
          "writable": true
        },
        {
          "name": "witnessGoals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  116,
                  110,
                  101,
                  115,
                  115,
                  95,
                  103,
                  111,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "arg",
                "path": "witness"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "goalId",
          "type": "u64"
        },
        {
          "name": "witness",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initializeGoalManager",
      "discriminator": [
        165,
        12,
        34,
        158,
        63,
        166,
        31,
        203
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "goalManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  111,
                  97,
                  108,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateGoalCount",
      "discriminator": [
        224,
        51,
        240,
        233,
        165,
        94,
        74,
        56
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "goalManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  111,
                  97,
                  108,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "goalCount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateProgress",
      "discriminator": [
        135,
        47,
        78,
        113,
        27,
        158,
        21,
        111
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "goal",
          "writable": true
        },
        {
          "name": "progressUpdate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  101,
                  115,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "goal.goal_id",
                "account": "goalInfo"
              },
              {
                "kind": "account",
                "path": "goal.progress_update_counter",
                "account": "goalInfo"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "goalId",
          "type": "u64"
        },
        {
          "name": "content",
          "type": "string"
        },
        {
          "name": "progressPercentage",
          "type": "u64"
        },
        {
          "name": "proofFileBlobId",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "agent",
      "discriminator": [
        47,
        166,
        112,
        147,
        155,
        197,
        86,
        7
      ]
    },
    {
      "name": "comment",
      "discriminator": [
        150,
        135,
        96,
        244,
        55,
        199,
        50,
        65
      ]
    },
    {
      "name": "goalInfo",
      "discriminator": [
        148,
        8,
        208,
        94,
        103,
        212,
        204,
        248
      ]
    },
    {
      "name": "goalManagerInfo",
      "discriminator": [
        147,
        55,
        99,
        221,
        215,
        135,
        169,
        58
      ]
    },
    {
      "name": "progressUpdate",
      "discriminator": [
        128,
        253,
        80,
        56,
        205,
        185,
        254,
        234
      ]
    },
    {
      "name": "userGoalsInfo",
      "discriminator": [
        218,
        72,
        230,
        215,
        197,
        12,
        142,
        0
      ]
    },
    {
      "name": "witnessGoalsInfo",
      "discriminator": [
        158,
        156,
        72,
        2,
        197,
        78,
        138,
        114
      ]
    }
  ],
  "events": [
    {
      "name": "commentCreatedEvent",
      "discriminator": [
        160,
        189,
        202,
        115,
        93,
        85,
        148,
        159
      ]
    },
    {
      "name": "createAgentEvent",
      "discriminator": [
        93,
        170,
        214,
        27,
        113,
        140,
        184,
        161
      ]
    },
    {
      "name": "eventGoalCompleted",
      "discriminator": [
        229,
        150,
        96,
        150,
        88,
        131,
        215,
        47
      ]
    },
    {
      "name": "eventGoalCountUpdated",
      "discriminator": [
        2,
        192,
        91,
        141,
        77,
        101,
        59,
        63
      ]
    },
    {
      "name": "eventGoalCreated",
      "discriminator": [
        60,
        32,
        82,
        59,
        237,
        230,
        231,
        89
      ]
    },
    {
      "name": "eventGoalFailed",
      "discriminator": [
        80,
        245,
        46,
        175,
        226,
        227,
        71,
        208
      ]
    },
    {
      "name": "eventWitnessConfirmed",
      "discriminator": [
        73,
        162,
        95,
        28,
        211,
        66,
        17,
        158
      ]
    },
    {
      "name": "eventWitnessGoalAdded",
      "discriminator": [
        63,
        229,
        117,
        36,
        91,
        9,
        104,
        196
      ]
    },
    {
      "name": "progressUpdateEvent",
      "discriminator": [
        60,
        42,
        197,
        228,
        80,
        204,
        188,
        241
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidDeadline",
      "msg": ""
    },
    {
      "code": 6001,
      "name": "goalNotActive",
      "msg": ""
    },
    {
      "code": 6002,
      "name": "deadlineNotReached",
      "msg": ""
    },
    {
      "code": 6003,
      "name": "emptyWitnesses",
      "msg": ""
    },
    {
      "code": 6004,
      "name": "notWitness",
      "msg": ""
    },
    {
      "code": 6005,
      "name": "alreadyConfirmed",
      "msg": ""
    },
    {
      "code": 6006,
      "name": "notAllWitnessesConfirmed",
      "msg": ""
    },
    {
      "code": 6007,
      "name": "notGoalRelatedMember",
      "msg": ""
    },
    {
      "code": 6008,
      "name": "allWitnessesConfirmed",
      "msg": ""
    },
    {
      "code": 6009,
      "name": "notGoalCreator",
      "msg": ""
    },
    {
      "code": 6010,
      "name": "agentIdTooShort",
      "msg": "Agent ID太短"
    },
    {
      "code": 6011,
      "name": "agentNameTooShort",
      "msg": "agent"
    },
    {
      "code": 6012,
      "name": "charactorJsonTooShort",
      "msg": "json"
    },
    {
      "code": 6013,
      "name": "agentAlreadyExists",
      "msg": "agent"
    },
    {
      "code": 6014,
      "name": "agentNotExists",
      "msg": "agent"
    },
    {
      "code": 6015,
      "name": "invalidProgressPercentage",
      "msg": ""
    },
    {
      "code": 6016,
      "name": "insufficientPayment",
      "msg": ""
    }
  ],
  "types": [
    {
      "name": "agent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agentId",
            "type": "string"
          },
          {
            "name": "agentName",
            "type": "string"
          },
          {
            "name": "charactorJson",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "comment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "commentCreatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "commentId",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createAgentEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agentId",
            "type": "string"
          },
          {
            "name": "agentName",
            "type": "string"
          },
          {
            "name": "charactorJson",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "eventGoalCompleted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "completer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "eventGoalCountUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goalCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "eventGoalCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "eventGoalFailed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "failer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "eventWitnessConfirmed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "witness",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "eventWitnessGoalAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "witness",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "goalInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "aiSuggestion",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "deadline",
            "type": "u64"
          },
          {
            "name": "witnesses",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "confirmations",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "commentCounter",
            "type": "u64"
          },
          {
            "name": "progressPercentage",
            "type": "u64"
          },
          {
            "name": "progressUpdateCounter",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "goalManagerInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "goalCount",
            "type": "u64"
          },
          {
            "name": "activeGoals",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "failedGoals",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "completedGoals",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "totalBalance",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "progressUpdate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "proofFileBlobId",
            "type": "string"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "progressUpdateEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goalId",
            "type": "u64"
          },
          {
            "name": "updateId",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "progressPercentage",
            "type": "u64"
          },
          {
            "name": "proofFileBlobId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "userGoalsInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "goalIds",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "witnessGoalsInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "goalIds",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    }
  ]
};
