'use client'

import { useProgram } from '@/lib/program'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useWalletUi, useWalletUiCluster } from '@wallet-ui/react'
import { useTransactionToast } from '../use-transaction-toast'

// 查询合约状态
export function useContractState() {
  const { cluster } = useWalletUiCluster()
  const program = useProgram()

  return useQuery({
    queryKey: ['contract-state', { cluster }],
    queryFn: async () => {
      // 使用 program.account 来查询账户数据
      const data = await program.account.yourAccount.fetch(accountAddress)
      return data
    }
  })
}

// 调用合约方法
export function useContractMethod() {
  const { cluster } = useWalletUiCluster()
  const program = useProgram()
  const toastTransaction = useTransactionToast()

  return useMutation({
    mutationKey: ['contract-method', { cluster }],
    mutationFn: async (params: any) => {
      try {
        // 直接调用合约方法，不需要手动构建指令
        const tx = await program.methods
          .yourMethod(params)
          .accounts({
            // 根据你的合约定义填写所需账户
          })
          .rpc()

        return tx
      } catch (error) {
        console.error('合约调用失败:', error)
        throw error
      }
    },
    onSuccess: (signature) => {
      toastTransaction(signature)
    }
  })
}