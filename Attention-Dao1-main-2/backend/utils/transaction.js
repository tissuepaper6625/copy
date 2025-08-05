import { PrivyClient } from "@privy-io/server-auth";
import { ethers } from "ethers";

const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_splitsWarehouse",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "split",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "allocations",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalAllocation",
            "type": "uint256"
          },
          {
            "internalType": "uint16",
            "name": "distributionIncentive",
            "type": "uint16"
          }
        ],
        "indexed": false,
        "internalType": "struct SplitV2Lib.Split",
        "name": "splitParams",
        "type": "tuple"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      }
    ],
    "name": "SplitCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "split",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "allocations",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalAllocation",
            "type": "uint256"
          },
          {
            "internalType": "uint16",
            "name": "distributionIncentive",
            "type": "uint16"
          }
        ],
        "indexed": false,
        "internalType": "struct SplitV2Lib.Split",
        "name": "splitParams",
        "type": "tuple"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "SplitCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "SPLIT_WALLET_IMPLEMENTATION",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "allocations",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalAllocation",
            "type": "uint256"
          },
          {
            "internalType": "uint16",
            "name": "distributionIncentive",
            "type": "uint16"
          }
        ],
        "internalType": "struct SplitV2Lib.Split",
        "name": "_splitParams",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      }
    ],
    "name": "createSplit",
    "outputs": [
      {
        "internalType": "address",
        "name": "split",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "allocations",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalAllocation",
            "type": "uint256"
          },
          {
            "internalType": "uint16",
            "name": "distributionIncentive",
            "type": "uint16"
          }
        ],
        "internalType": "struct SplitV2Lib.Split",
        "name": "_splitParams",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_salt",
        "type": "bytes32"
      }
    ],
    "name": "createSplitDeterministic",
    "outputs": [
      {
        "internalType": "address",
        "name": "split",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "allocations",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalAllocation",
            "type": "uint256"
          },
          {
            "internalType": "uint16",
            "name": "distributionIncentive",
            "type": "uint16"
          }
        ],
        "internalType": "struct SplitV2Lib.Split",
        "name": "_splitParams",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_salt",
        "type": "bytes32"
      }
    ],
    "name": "isDeployed",
    "outputs": [
      {
        "internalType": "address",
        "name": "split",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      }
    ],
    "name": "nonces",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "allocations",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalAllocation",
            "type": "uint256"
          },
          {
            "internalType": "uint16",
            "name": "distributionIncentive",
            "type": "uint16"
          }
        ],
        "internalType": "struct SplitV2Lib.Split",
        "name": "_splitParams",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "predictDeterministicAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "allocations",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalAllocation",
            "type": "uint256"
          },
          {
            "internalType": "uint16",
            "name": "distributionIncentive",
            "type": "uint16"
          }
        ],
        "internalType": "struct SplitV2Lib.Split",
        "name": "_splitParams",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_salt",
        "type": "bytes32"
      }
    ],
    "name": "predictDeterministicAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const generateSplit = async (attention, userAddress, influencer) => {
  try {
    const privy = new PrivyClient(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);
    const provider = new ethers.JsonRpcProvider('https://base-mainnet.g.alchemy.com/v2/4AT553C4Swn44N9DEGCh7iYScDk1BMH_');
    const clankerWallet = process.env.CLANKER_FACTORY_ADDRESS;
    const grokWallet = process.env.GROK_WALLET_ADDRESS;
    const contractInterface = new ethers.Interface(abi);
    const data = contractInterface.encodeFunctionData("createSplit", [
      {
        recipients: [attention, clankerWallet, userAddress, influencer, grokWallet],
        allocations: [250000, 200000, 400000, 100000, 50000],
        totalAllocation: 1000000,
        distributionIncentive: 0,
      },
      userAddress,
      ethers.ZeroAddress
    ]);
    const { hash } = await privy.walletApi.ethereum.sendTransaction({
      walletId: "q2lg94ryfhsozjgsp2cyksui",
      caip2: "eip155:8453",
      transaction: {
        to: process.env.SPLIT_FACTORY_ADDRESS,
        chainId: 8453,
        data: data
      }
    });
    const receipt = await provider.waitForTransaction(hash);
    const spliteAddress = receipt.logs[2].topics[1];
    const abiCoder = new ethers.AbiCoder();
    const address = abiCoder.decode(["address"], spliteAddress)[0];
    return address
  } catch (error) {
    console.log(error)
  }
}