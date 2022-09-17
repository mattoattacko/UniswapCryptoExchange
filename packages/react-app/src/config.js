import { Goerli } from "@usedapp/core";

export const ROUTER_ADDRESS = "0x79A72ef55457A97189e7178377EC9ae64c106D3f"; 

export const DAPP_CONFIG = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: "https://eth-goerli.g.alchemy.com/v2/e3Q-1LAkP1LMdsabmOv1SWkW-HdzXKRJ",
  },
};