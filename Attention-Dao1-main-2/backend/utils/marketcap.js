import axios from "axios"
import TokenModel from "../model/Token.js";

export const fetchPosition = async (position_id) => {
  try {
    const result = await axios.post("https://interface.gateway.uniswap.org/v2/pools.v1.PoolsService/GetPosition", {
      "chainId": 8453,
      "protocolVersion": "PROTOCOL_VERSION_V3",
      "tokenId": position_id,
      "owner": "0x0000000000000000000000000000000000000000"
    }, {
      headers: {
        "accept": "*/*",
        "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://app.uniswap.org",
        "priority": "u=1, i",
        "referer": "https://app.uniswap.org/",
        "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      }
    });

    const position = result.data.position;
    if (position.v3Position) {
      const { token0UncollectedFees: unCollectedFeeToken, token1UncollectedFees: unCollectedFeeNative } = position.v3Position;
      await TokenModel.updateOne({
        position_id
      }, {
        unCollectedFeeToken,
        unCollectedFeeNative
      });
    }

  } catch (err) {

  }
}

export const fetchTokenPrice = async (current_token) => {
  try {
    const query =
      `query TokenPrice(
        $chain: Chain!
        $address: String = null
        $duration: HistoryDuration!
        $fallback: Boolean = false
      ) {
        token(chain: $chain, address: $address) {
          id
          address
          chain
          market(currency: USD) {
            id
            price {
              id
              value
              __typename
            }
            totalValueLocked {
              id
              value
              currency
              __typename
            }
            volume24H: volume(duration: DAY) {
              id
              value
              currency
              __typename
            }
            volumeWeek: volume(duration: WEEK) {
              id
              value
              currency
              __typename
            }
            volume30D: volume(duration: MONTH) {
              id
              value
              currency
              __typename
            }
            priceHistory(duration: $duration) @include(if: $fallback) {
              ...PriceHistoryFallback
              __typename
            }
            __typename
          }
          project {
            markets(currencies: [USD]) {
              id
              fullyDilutedValuation {
                id
                value
                currency
                __typename
              }
              marketCap {
                id
                value
                currency
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
      }

      fragment PriceHistoryFallback on TimestampedAmount {
        id
        value
        timestamp
        __typename
      }
    `;
    const result = await axios.post("https://interface.gateway.uniswap.org/v1/graphql", {
      query,
      variables: {
        "address": current_token.contract_address,
        "fallback": true,
        "chain": "BASE",
        "duration": "DAY"
      }
    }, {
      headers: {
        "accept": "*/*",
        "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://app.uniswap.org",
        "priority": "u=1, i",
        "referer": "https://app.uniswap.org/",
        "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      }
    });

    const token = result.data.data.token;
    if (token) {
      const { price, volume24H, volumeWeek, volume30D, totalValueLocked } = token.market;
      const { markets } = token.project;
      let marketCap = 0;
      markets.map((market) => {
        marketCap += market.marketCap.value;
      });
      await TokenModel.updateOne({
        position_id: current_token.position_id
      }, {
        price: price.value,
        market_cap: marketCap,
        volume24H: volume24H.value,
        volumeWeek: volumeWeek.value,
        volume30D: volume30D.value,
        last_price: current_token.price,
        last_market_cap: current_token.market_cap,
        last_volume24H: current_token.volume24H,
        last_volumeWeek: current_token.volumeWeek,
        last_volume30D: current_token.volume30D,
        totalValueLocked: totalValueLocked.value
      });
    }
    return token;

  } catch (err) {
    console.log(err)
  }
}

export const fetchPriceHistory = async (contract_address, duration = "DAY") => {
  try {
    const query =
      `query TokenPrice(
        $chain: Chain!
        $address: String = null
        $duration: HistoryDuration!
        $fallback: Boolean = false
      ) {
        token(chain: $chain, address: $address) {
          id
          address
          chain
          market(currency: USD) {
            id
            priceHistory(duration: $duration) @include(if: $fallback) {
              ...PriceHistoryFallback
              __typename
            }
            __typename
          }
          __typename
        }
      }

      fragment PriceHistoryFallback on TimestampedAmount {
        id
        value
        timestamp
        __typename
      }
    `;
    const result = await axios.post("https://interface.gateway.uniswap.org/v1/graphql", {
      query,
      variables: {
        "address": contract_address,
        "fallback": true,
        "chain": "BASE",
        "duration": duration
      }
    }, {
      headers: {
        "accept": "*/*",
        "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://app.uniswap.org",
        "priority": "u=1, i",
        "referer": "https://app.uniswap.org/",
        "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      }
    });

    const token = result.data.data.token;
    return token;

  } catch (err) {
    console.log(err)
  }
}

export const fetchWalletBalance = async (wallet_address) => {
  try {
    const query =
      `query PortfolioBalances($ownerAddress: String!, $valueModifiers: [PortfolioValueModifier!], $chains: [Chain!]!) {
        portfolios(
          ownerAddresses: [$ownerAddress]
          chains: $chains
          valueModifiers: $valueModifiers
        ) {
          id
          tokensTotalDenominatedValue {
            value
            __typename
          }
          __typename
        }
      }
      
    `;
    const result = await axios.post("https://interface.gateway.uniswap.org/v1/graphql", {
      query,
      variables: {
        "ownerAddress": wallet_address,
        "valueModifiers": [
          {
            "ownerAddress": wallet_address,
            "tokenIncludeOverrides": [],
            "tokenExcludeOverrides": [],
            "includeSmallBalances": false,
            "includeSpamTokens": false
          }
        ],
        "chains": [
          "BASE",
        ]
      }
    }, {
      headers: {
        "accept": "*/*",
        "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://app.uniswap.org",
        "priority": "u=1, i",
        "referer": "https://app.uniswap.org/",
        "sec-ch-ua": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      }
    });

    const balance = result.data.data.portfolios[0].tokensTotalDenominatedValue.value;
    return balance;

  } catch (err) {
    console.log(err)
  }
}