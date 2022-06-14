import { PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { round } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import config, {
  puffBurnerWallet,
  connection,
  allToken,
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
      console.log(allToken, TREASURY_ADDRESS, config.rpcHost)

      const puffTreasuryTokenAccount = (await getTokenAccount(
        connection,
        allToken,
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
        allToken,
        payoutWallet
      ))!!
      const puffPayoutAccountBalance = await connection.getTokenAccountBalance(
        puffPayoutAccount.pubkey
      )

      const burnerWalletAccount = (await getTokenAccount(
        connection,
        allToken,
        puffBurnerWallet
      ))!!
      const burnerWalletBalance = await connection.getTokenAccountBalance(
        burnerWalletAccount.pubkey
      )

      const burnedSupply = burnerWalletBalance.value.uiAmount

      // 2XkiMS2BzjwR7UpMiaJhEjg6TpipBpyrf7RvtS4VtPsL - raydium input
      const walletsToExclude = ['2XkiMS2BzjwR7UpMiaJhEjg6TpipBpyrf7RvtS4VtPsL', '4zn6X4aLNjUvMx6hYKTxG1Zw9ixYTdTWvJSrDw6JK8rJ', 'TGPDuarmJ1R6mB1EWxSmu5uHkPeqaqBy319K3WosyW9']

      let totalBalanceOfWalletsToExclude = 0

      for (const walletToExclude of walletsToExclude) {
        const walletToExcludePubKey = new PublicKey(walletToExclude)
        const walletToExcludeAccount = (await getTokenAccount(
          connection,
          allToken,
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
        burnedSupply,
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
          (burnedSupply ?? 0) -
          totalBalanceOfWalletsToExclude
      )

      const query = {
        operationName: 'getProjectInstancesQuery',
        query:
          'query getProjectInstancesQuery($condition: GetProjectInstancesCondition, $order_by: [OrderConfig!], $pagination_info: PaginationConfig) {\n  getProjectInstances(\n    condition: $condition\n    order_by: $order_by\n    pagination_info: $pagination_info\n  ) {\n    project_instances {\n      project_id\n      token_address\n      name\n      rarity_est\n      rank_est\n      rarity\n      rank\n      full_img\n      small_img\n      attributes\n      created_at\n      updated_at\n      latest_valuation {\n        price\n        __typename\n      }\n      floor_price\n      __typename\n    }\n    pagination_info {\n      current_page_number\n      current_page_size\n      has_next_page\n      total_page_number\n      __typename\n    }\n    __typename\n  }\n}\n',
        variables: {
          order_by: [{ field_name: 'name', sort_order: 'ASC' }],
          condition: {
            token_addresses: [
              'nnsyke25QR3yJAmAuQhjESEHHjs93iyUqKaKPhGWtQh',
              '5e6uW3u7BR24UK9jakra9iipW1AQv5fSVmChQsFN4b6G',
              'JEHyBUytNhtMNrHCYSsLuyWfnH5jnjDdzspUtLzVBGkc',
              '7vHjmBmv2MBjDBJPeDaWiJXkmZ1UoftoK2QKmCMzrA7q',
            ],
          },
          pagination_info: { page_size: 164 },
          page_size: 164,
        },
      }

      const valueRes = await axios.post(
        'https://solanalysis-graphql-dot-feliz-finance.uc.r.appspot.com/',
        query
      )
      let totalFractionalizedNFTValue = 0
      for (const projectInstance of valueRes.data.data.getProjectInstances
        .project_instances) {
        console.log(projectInstance)

        if (projectInstance.project_id === 'thugbirdz') {
          totalFractionalizedNFTValue += 180
          continue
        }
        totalFractionalizedNFTValue +=
          projectInstance?.latest_valuation?.price ??
          (projectInstance?.floor_price ?? 0) * 1.3
      }

      console.log(totalFractionalizedNFTValue)

      const puffHistory = await axios.get(
        'https://api.coingecko.com/api/v3/coins/puff/market_chart?vs_currency=usd&days=14'
      )

      let totalLiquidity = 0
      let total24HrVolume = 0

      res.json({
        burnedSupply,
        circulatingSupply,
        totalFractionalizedNFTValue,
        puffPriceHistory: puffHistory.data.prices,
        puffDailyVolume:
          puffHistory.data.total_volumes[
            puffHistory.data.total_volumes.length - 1
          ][1],
      })
  }
}
