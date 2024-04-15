export const txData1 = {
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: "553a5f5486725314aa5a95ca5607ba06b8fe33635a0965afb9ad4b9330f878dd",
      vout: 0,
      prevout: {
        scriptpubkey: "0014cf9485e25e2f157f1a74df358f9631f443f2ceda",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_20 cf9485e25e2f157f1a74df358f9631f443f2ceda",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "bc1qe72gtcj79u2h7xn5mu6cl93373pl9nk6ggnhe2",
        value: 186793,
      },
      scriptsig: "",
      scriptsig_asm: "",

      witness: [
        "304502210088293a6e6212333ec670bda8c323df137b29e6134ef56bf75fadf2118e53900002202165f7bf50a7e67029831e12151dbac997a7a62d76498af5918d37496467f19901",
        "022566ca0b1db869de1312f602de41e3933b3ec1a0ec2de35f83996f23da3a0d2c",
      ],
      is_coinbase: false,
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey: "00148d0dfeb567d8c224af2e9b8e5d2cce8b0ae7551a",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 8d0dfeb567d8c224af2e9b8e5d2cce8b0ae7551a",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1q35xladt8mrpzftewnw896txw3v9ww4g67uzlgm",
      value: 183823,
    },
  ],
};

export const txData = {
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: "492c8a34b81f3d21ccabad349befc1f7c81dc54b68e3c42e60830d29f1d069e1",
      vout: 1,
      prevout: {
        scriptpubkey: "76a914b9c457c7848ccb1be09e0e32659229a68d4deb1788ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 b9c457c7848ccb1be09e0e32659229a68d4deb17 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "1HwFDdduGgvU6ES36X7L3RiA4epQA8KrQX",
        value: 85112016,
      },
      scriptsig:
        "47304402206acd8ac31277300da0fc72c88eb9ef1fdc3099bc91cc700c87ffe9b555df7dc6022024e94a504713fc63ec9682bf5dfcfe48db31eb74dd4be58d33effee601af6074012103c3ce451e8b53088d6e905987eb2e195776ab9d80fc03fedb30776d3135e8aa52",
      scriptsig_asm:
        "OP_PUSHBYTES_71 304402206acd8ac31277300da0fc72c88eb9ef1fdc3099bc91cc700c87ffe9b555df7dc6022024e94a504713fc63ec9682bf5dfcfe48db31eb74dd4be58d33effee601af607401 OP_PUSHBYTES_33 03c3ce451e8b53088d6e905987eb2e195776ab9d80fc03fedb30776d3135e8aa52",
      is_coinbase: false,
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey: "a914c422d2c04e12185a2b5aaf98e118a42de09f55bc87",
      scriptpubkey_asm:
        "OP_HASH160 OP_PUSHBYTES_20 c422d2c04e12185a2b5aaf98e118a42de09f55bc OP_EQUAL",
      scriptpubkey_type: "p2sh",
      scriptpubkey_address: "3Ka65hnvmDXSfHAEq5ZgcivDSDnsSRP99F",
      value: 149066,
    },
    {
      scriptpubkey: "76a914b9c457c7848ccb1be09e0e32659229a68d4deb1788ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 b9c457c7848ccb1be09e0e32659229a68d4deb17 OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "1HwFDdduGgvU6ES36X7L3RiA4epQA8KrQX",
      value: 84960025,
    },
  ],
};

export const txData2 = {
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: "",
      vout: 1,
      prevout: {
        scriptpubkey: "76a914e4972c8157e65cb0a09a3e69876e7080f183d5be88ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 e4972c8157e65cb0a09a3e69876e7080f183d5be OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "1MqgAUsLcDvgUBXnhRQA72No3jdo6S9zWr",
        value: 832680,
      },
      scriptsig:
        "4730440220256db9349c1f80806fdeb6e59a49b0b1d6fa1262d945ac897f35fabe6a24e62602200fcf4fae81eaa497d6899da5d8e12b7dedd1960b9c8365f90e7a4bb54252c4b20121026cedd450da5d8f3a5e2bb4df0de2d41df8351067a055aa1c911ea84db963eaf8",
      scriptsig_asm:
        "OP_PUSHBYTES_71 30440220256db9349c1f80806fdeb6e59a49b0b1d6fa1262d945ac897f35fabe6a24e62602200fcf4fae81eaa497d6899da5d8e12b7dedd1960b9c8365f90e7a4bb54252c4b201 OP_PUSHBYTES_33 026cedd450da5d8f3a5e2bb4df0de2d41df8351067a055aa1c911ea84db963eaf8",
      is_coinbase: false,
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      // the bug is due to limited support for opCodes here like 6a => OpReturn
      scriptpubkey:
        "6a36a2825c6379100132034bae0a27d09eb962ff64ba5bcb393b4f38bccce097b6fec9030631bbce25267c8b9a43f6d73683b919ad2498ba",
      scriptpubkey_asm:
        "OP_RETURN OP_PUSHBYTES_54 a2825c6379100132034bae0a27d09eb962ff64ba5bcb393b4f38bccce097b6fec9030631bbce25267c8b9a43f6d73683b919ad2498ba",
      scriptpubkey_type: "op_return",
      value: 0,
    },
    {
      scriptpubkey: "76a914e4972c8157e65cb0a09a3e69876e7080f183d5be88ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 e4972c8157e65cb0a09a3e69876e7080f183d5be OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "1MqgAUsLcDvgUBXnhRQA72No3jdo6S9zWr",
      value: 828192,
    },
  ],
};

export const txData3 = {
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: "956932799808887e7ea4fc84cb0b7a0b61e38f8d4029f29f22a8ca4ca91b584f",
      vout: 27,
      prevout: {
        scriptpubkey:
          "5120727da28731cccc6f227d0200b43c384ae06e717f6f14f62f31145a8cbb145048",
        scriptpubkey_asm:
          "OP_PUSHNUM_1 OP_PUSHBYTES_32 727da28731cccc6f227d0200b43c384ae06e717f6f14f62f31145a8cbb145048",
        scriptpubkey_type: "v1_p2tr",
        scriptpubkey_address:
          "bc1pwf769pe3enxx7gnaqgqtg0pcftsxuutldu20vte3z3dgewc52pyq83gryt",
        value: 2161,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "b525f5cc7827fe746bb708a0d4ddf8963a7c16633b33f8883cb419b48dbebce9852daa38ff116a1667542b507ee94e70fe1bd335ca0d35382ca9683c3baf4f21",
        "2060847fc4278bc4c26babdb16309fba96c1dd2fbd2c9656372568b6cfe52f5e53ac0063036f726401010a746578742f706c61696e00347b2270223a226272632d3230222c227469636b223a2268756875222c226f70223a226d696e74222c22616d74223a22313030227d68",
        "c160847fc4278bc4c26babdb16309fba96c1dd2fbd2c9656372568b6cfe52f5e53",
      ],
      is_coinbase: false,
      sequence: 4294967293,
    },
  ],
  vout: [
    {
      scriptpubkey:
        "5120deef3731bdcccf281c4800106602316ecdfb41e67097243522f910241bffc616",
      scriptpubkey_asm:
        "OP_PUSHNUM_1 OP_PUSHBYTES_32 deef3731bdcccf281c4800106602316ecdfb41e67097243522f910241bffc616",
      scriptpubkey_type: "v1_p2tr",
      scriptpubkey_address:
        "bc1pmmhnwvdaen8js8zgqqgxvq33dmxlks0xwztjgdfzlygzgxllcctqugtsss",
      value: 546,
    },
  ],
};

export const txData4 = {
  version: 2,
  locktime: 834489,
  vin: [
    {
      txid: "67ce24574ea93ed360d1a6aa5f3ea0174d4aa53b3883d93f6c6d5d289ca38207",
      vout: 1,
      prevout: {
        scriptpubkey:
          "5120096787e682fb833ca89b603502766144522cca8181959fe52929ff7bd3094081",
        scriptpubkey_asm:
          "OP_PUSHNUM_1 OP_PUSHBYTES_32 096787e682fb833ca89b603502766144522cca8181959fe52929ff7bd3094081",
        scriptpubkey_type: "v1_p2tr",
        scriptpubkey_address:
          "bc1pp9nc0e5zlwpne2ymvq6syanpg3fzej5psx2eleff98lhh5cfgzqs39ndsx",
        value: 47006241,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "723691b6d7f4afff16d27fa2653fde8f4eccb75760ab67272e669724e2f1604e2aee5f886f84d3c8eaa92dffe13970802d1438f883c20d419a4d945133849cd1",
      ],
      is_coinbase: false,
      sequence: 4294967293,
    },
    {
      txid: "58a9f5efbec6d5db968c1dc6f363a714680d52430cc8df9dd6a1800d62a7b420",
      vout: 0,
      prevout: {
        scriptpubkey:
          "0020de24a01de89994e1b80bc0938d808aa9dc1f773a5ad77a8dae8c62d66d01d92a",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_32 de24a01de89994e1b80bc0938d808aa9dc1f773a5ad77a8dae8c62d66d01d92a",
        scriptpubkey_type: "v0_p2wsh",
        scriptpubkey_address:
          "bc1qmcj2q80gnx2wrwqtczfcmqy248wp7ae6ttth4rdw333dvmgpmy4qtys2sr",
        value: 330,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "3044022027d04c6b6cc87778d95af6bd6c0e909c24dd4d5c0d9e0e256976c11e41b149730220521b9a1665f3086c2308eb56f9a6b3d8b0c4bc4395c4edadafeb81a514d8c58b01",
        "2102b2fb48ce4536bc0218d0d72d84d791f07649b0650cecb46d9b1ee94afc1785d4ac736460b268",
      ],
      is_coinbase: false,
      sequence: 4294967293,
      inner_witnessscript_asm:
        "OP_PUSHBYTES_33 02b2fb48ce4536bc0218d0d72d84d791f07649b0650cecb46d9b1ee94afc1785d4 OP_CHECKSIG OP_IFDUP OP_NOTIF OP_PUSHNUM_16 OP_CSV OP_ENDIF",
    },
  ],
  vout: [
    {
      scriptpubkey: "0014dd8657cef1091c4e6ce2619757330080f6d29744",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 dd8657cef1091c4e6ce2619757330080f6d29744",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1qmkr90nh3pywyum8zvxt4wvcqsrmd996ys46psa",
      value: 46993085,
    },
  ],
};

export const txData5 = {
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: "94df6f20970e1f5c4635780cdaa0781a13c9046c70cb35d8108dbdb2877d5a59",
      vout: 0,
      prevout: {
        scriptpubkey: "76a9147f0f6a2f76c096ce1c57abfef413b1f38ec407c588ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 7f0f6a2f76c096ce1c57abfef413b1f38ec407c5 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "1CaqHQEhHUgo6JUUCupb7GtGFVkUgnSqR7",
        value: 1000000,
      },
      scriptsig:
        "483045022100bf3ec2ec7506a3c3e29f5ee4d39162ccdb063fb547f1749a1cc282b9b7a261c9022029cedd3aea84c612012856cd654a639a3112cfcdf3fa5b7c9815a29496f280010121027db40e505a98750020729f1b08572d2a5a0454ea54f88b70b62b7bf2ee342c89",
      scriptsig_asm:
        "OP_PUSHBYTES_72 3045022100bf3ec2ec7506a3c3e29f5ee4d39162ccdb063fb547f1749a1cc282b9b7a261c9022029cedd3aea84c612012856cd654a639a3112cfcdf3fa5b7c9815a29496f2800101 OP_PUSHBYTES_33 027db40e505a98750020729f1b08572d2a5a0454ea54f88b70b62b7bf2ee342c89",
      is_coinbase: false,
      sequence: 4294967295,
    },
    {
      txid: "6bb902771f52e7cde26113956eecdb24c9cc5fb6d99b737eebdd93ac6d0142cf",
      vout: 1,
      prevout: {
        scriptpubkey: "76a914a18f6ffb0dfe94c90e8845a5b8e8f0abcfefcaec88ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 a18f6ffb0dfe94c90e8845a5b8e8f0abcfefcaec OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "1FjFd6KPgzAHf9SKWQgPbXi4R7MhMicjCW",
        value: 399308,
      },
      scriptsig:
        "4730440220255120a922100f554308dab412d8151282314439155d8036ff4ef6a19410e7a80220676b4dcc65e95e45ffb919401f05d26d504f6298a0bc59c69a25f8128250fd10012103cc748e1bda9420ca3b2a98ef207626350156f8eec84d6cd1d8e03f8bb7129cc1",
      scriptsig_asm:
        "OP_PUSHBYTES_71 30440220255120a922100f554308dab412d8151282314439155d8036ff4ef6a19410e7a80220676b4dcc65e95e45ffb919401f05d26d504f6298a0bc59c69a25f8128250fd1001 OP_PUSHBYTES_33 03cc748e1bda9420ca3b2a98ef207626350156f8eec84d6cd1d8e03f8bb7129cc1",
      is_coinbase: false,
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey: "76a91403fcf11bc69667fc2b6ebebac99bfd857954a31f88ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 03fcf11bc69667fc2b6ebebac99bfd857954a31f OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "1N63HMUrEC4n4W7iUscoHxFnrYJdGmEFs",
      value: 393698,
    },
    {
      scriptpubkey: "76a914e716d089a84759b490f242804b656899bfaab93788ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 e716d089a84759b490f242804b656899bfaab937 OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "1N4tRVwqMXj2auYkHY2frEQsEzWHrDZTdM",
      value: 1000000,
    },
  ],
};

export const txData6 = {
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: "3b7dc918e5671037effad7848727da3d3bf302b05f5ded9bec89449460473bbb",
      vout: 16,
      prevout: {
        scriptpubkey: "0014f8d9f2203c6f0773983392a487d45c0c818f9573",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_20 f8d9f2203c6f0773983392a487d45c0c818f9573",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "bc1qlrvlygpudurh8xpnj2jg04zupjqcl9tnk5np40",
        value: 37079526,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "30440220780ad409b4d13eb1882aaf2e7a53a206734aa302279d6859e254a7f0a7633556022011fd0cbdf5d4374513ef60f850b7059c6a093ab9e46beb002505b7cba0623cf301",
        "022bf8c45da789f695d59f93983c813ec205203056e19ec5d3fbefa809af67e2ec",
      ],
      is_coinbase: false,
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey: "76a9146085312a9c500ff9cc35b571b0a1e5efb7fb9f1688ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 6085312a9c500ff9cc35b571b0a1e5efb7fb9f16 OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "19oMRmCWMYuhnP5W61ABrjjxHc6RphZh11",
      value: 100000,
    },
    {
      scriptpubkey: "0014ad4cc1cc859c57477bf90d0f944360d90a3998bf",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 ad4cc1cc859c57477bf90d0f944360d90a3998bf",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1q44xvrny9n3t5w7lep58egsmqmy9rnx9lt6u0tc",
      value: 36977942,
    },
  ],
};
