import { PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { round } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import config, {
  puffBurnerWallet,
  connection,
  puffToken,
  TREASURY_ADDRESS,
} from '../../../config/config'
import { getTokenAccount } from '../../../utils/solUtils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
  } = req

  switch (method) {
    case 'GET':
      console.log(puffToken, TREASURY_ADDRESS, config.rpcHost)

      const puffTreasuryTokenAccount = (await getTokenAccount(
        connection,
        puffToken,
        TREASURY_ADDRESS
      ))!!
      console.log(puffTreasuryTokenAccount)

      const puffTreasuryBalance = (await connection.getTokenAccountBalance(
        puffTreasuryTokenAccount.pubkey
      ))!!

      const payoutWallet = new PublicKey(
        'BUHEzkqGnyxd8GQQzFnkaM5SfVhqZcEjhuCauPuxQ3mz'
      )
      const puffPayoutAccount = (await getTokenAccount(
        connection,
        puffToken,
        payoutWallet
      ))!!
      const puffPayoutAccountBalance = await connection.getTokenAccountBalance(
        puffPayoutAccount.pubkey
      )

      const burnerWalletAccount = (await getTokenAccount(
        connection,
        puffToken,
        puffBurnerWallet
      ))!!
      const burnerWalletBalance = await connection.getTokenAccountBalance(
        burnerWalletAccount.pubkey
      )

      const burnedSupply = burnerWalletBalance.value.uiAmount

      // 2XkiMS2BzjwR7UpMiaJhEjg6TpipBpyrf7RvtS4VtPsL - raydium input
      const walletsToExclude = ['2XkiMS2BzjwR7UpMiaJhEjg6TpipBpyrf7RvtS4VtPsL', '4zn6X4aLNjUvMx6hYKTxG1Zw9ixYTdTWvJSrDw6JK8rJ', 'TGPDuarmJ1R6mB1EWxSmu5uHkPeqaqBy319K3WosyW9', 'JAtcB7V3WAs9L91LpFVJozezVvcHnScQmUfZESvDYpuy']

      const onChainBurnedSupply = 4200000
      let totalBalanceOfWalletsToExclude = 0

      const totalBurnedSupply = (burnedSupply ?? 0) + onChainBurnedSupply;

      for (const walletToExclude of walletsToExclude) {
        const walletToExcludePubKey = new PublicKey(walletToExclude)
        const walletToExcludeAccount = (await getTokenAccount(
          connection,
          puffToken,
          walletToExcludePubKey
        ))!!
        if (!walletToExcludeAccount) continue;
        const walletToExcludeAccountBalance =
          await connection.getTokenAccountBalance(walletToExcludeAccount.pubkey)
        console.log({walletToExclude, walletToExcludeAccountBalance: walletToExcludeAccountBalance.value.uiAmount})

        totalBalanceOfWalletsToExclude +=
          walletToExcludeAccountBalance.value.uiAmount ?? 0
      }

      console.log({totalBalanceOfWalletsToExclude});

      console.log(
        burnerWalletAccount.pubkey.toString(),
        totalBurnedSupply,
        puffTreasuryTokenAccount?.pubkey.toString(),
        puffTreasuryBalance.value.uiAmount,
        puffPayoutAccount.pubkey.toString(),
        puffPayoutAccountBalance.value.uiAmount,
        'total other',
        totalBalanceOfWalletsToExclude
      )
      const circulatingSupply = Math.round(
        420 * 1000 * 1000 -
          (puffTreasuryBalance.value.uiAmount ?? 0) -
          (puffPayoutAccountBalance.value.uiAmount ?? 0) -
          totalBalanceOfWalletsToExclude -
          totalBurnedSupply
      )

      const query = {
        operationName: 'GetMarketPlaceSnapshots',
        query:
          'query GetMarketPlaceSnapshots($condition: GetMarketPlaceSnapshotCondition, $pagination_info: PaginationConfig, $order_by: [OrderConfig!]) {\n  getMarketPlaceSnapshots(\n    condition: $condition\n    pagination_info: $pagination_info\n    order_by: $order_by\n  ) {\n    market_place_snapshots {\n      token_address\n      project_id\n      name\n      owner\n      rarity\n      rarity_est\n      rank\n      rank_est\n      supply\n      full_img\n      meta_data_img\n      meta_data_uri\n      attributes\n      floor_price\n      project_name\n      project_image\n      valuation_date\n      valuation_price\n      project_attributes {\n        name\n        counts\n        type\n        values\n        __typename\n      }\n      lowest_listing_mpa {\n        user_address\n        price\n        marketplace_program_id\n        type\n        signature\n        amount\n        broker_referral_address\n        block_timestamp\n        broker_referral_fee\n        escrow_address\n        fee\n        marketplace_fee_address\n        marketplace_instance_id\n        metadata\n        __typename\n      }\n      highest_bid_mpa {\n        marketplace_fee_address\n        fee\n        escrow_address\n        broker_referral_fee\n        broker_referral_address\n        block_timestamp\n        signature\n        amount\n        type\n        marketplace_program_id\n        marketplace_instance_id\n        price\n        user_address\n        metadata\n        __typename\n      }\n      __typename\n    }\n    pagination_info {\n      current_page_number\n      current_page_size\n      has_next_page\n      total_page_number\n      __typename\n    }\n    __typename\n  }\n}',
        variables: {
          order_by: [{ field_name: 'name', sort_order: 'ASC' }],
          condition: {
            token_addresses: [
              'nnsyke25QR3yJAmAuQhjESEHHjs93iyUqKaKPhGWtQh',
              '5e6uW3u7BR24UK9jakra9iipW1AQv5fSVmChQsFN4b6G',
              'JEHyBUytNhtMNrHCYSsLuyWfnH5jnjDdzspUtLzVBGkc',
              '7vHjmBmv2MBjDBJPeDaWiJXkmZ1UoftoK2QKmCMzrA7q',
              'FoE2wtFWvvNS47JQ5KcGxngWujCX3TXr1mYT8bHGVbx7',
              'FBBjTYaoyKKT1dSB6jokTbtThPR9SD4AC1bAbLVCQneS',
              '2x3AoZSBrP9sH6hjKgqKuG4UNFusBFqt45Pg7gFyEukx',
              'HE775mPE8t77UpLt6RXGPfN9dXbzdStiSkUDrSnbp1So'
            ],
          },
          pagination_info: { page_size: 164 },
          page_size: 164,
        },
      }

      /*
      const valueRes = await axios.post(
        'https://beta.api.solanalysis.com/graphql',
        query
      )
      let totalFractionalizedNFTValue = 0
      console.log(valueRes.data)
      for (const projectInstance of valueRes.data.data.getMarketPlaceSnapshots
        .market_place_snapshots) {
        console.log(projectInstance)

        if (projectInstance.project_id === 'thugbirdz') {
          totalFractionalizedNFTValue += 180
          continue
        }
        totalFractionalizedNFTValue +=
          projectInstance?.valuation_price ??
          (projectInstance?.floor_price ?? 0) * 1.3
      }

      console.log(totalFractionalizedNFTValue)
      */

      const puffHistory = await axios.get(
        'https://api.coingecko.com/api/v3/coins/puff/market_chart?vs_currency=usd&days=14'
      )
      const puffPrices = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana%2Cpuff&vs_currencies=usd%2Ccad'
      )
      const puffMarketData = await axios.get(
        'https://api.coingecko.com/api/v3/coins/puff?market_data=true'
      )

      const puffUsdPrice = puffMarketData.data.market_data.current_price.usd
      const puffPriceAbsolutChange = puffMarketData.data.market_data.price_change_24h_in_currency.usd
      const puffPricePercentageChange = puffPriceAbsolutChange / (puffUsdPrice - puffPriceAbsolutChange) * 100
      const puffUsdVolume = puffMarketData.data.market_data.total_volume.usd
      

      let totalLiquidity = 0
      let total24HrVolume = 0

      res.json({
        burnedSupply: totalBurnedSupply,
        circulatingSupply,
        totalFractionalizedNFTValue: 770,
        puffUsdPrice: puffUsdPrice,
        puffSolanaPrice: puffUsdPrice / puffPrices.data.solana.usd,
        solanaUsdPrice: puffPrices.data.puff.usd,
        puffPriceAbsolutChange,
        puffPricePercentageChange,
        puffPriceHistory: puffHistory.data.prices,
        puffDailyVolume:
          puffHistory.data.total_volumes[
            puffHistory.data.total_volumes.length - 1
          ][1],
      })
  }
}
