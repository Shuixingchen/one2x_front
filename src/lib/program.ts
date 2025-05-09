import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor'
import { useWalletUi } from '@wallet-ui/react'

// 导入你的合约 IDL
import idl from '../idl/one2x.json'

export function useProgram() {
  const { client, account } = useWalletUi()

  const provider = new AnchorProvider(
    client.rpc,
    account as any, // 确保 account 兼容 AnchorProvider 所期望的 Wallet 接口
    AnchorProvider.defaultOptions()
  )

  // 修正：添加 programId 参数
  return new Program(idl as Idl, provider)
}