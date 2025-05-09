'use client'

import { WalletButton } from '../solana/solana-provider'
import { useQuery } from '@tanstack/react-query'
import { Pool } from '@/lib/data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function PoolListFeature() {
  const { data: pools, isLoading, error } = useQuery<Pool[]>({
    queryKey: ['pools'],
    queryFn: async () => {
      const response = await fetch('/api/pools')
      if (!response.ok) {
        throw new Error('Failed to fetch pools')
      }
      return response.json()
    }
  })


  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">加载失败: {error.message}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pools 列表</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>流动性</TableHead>
            <TableHead>创建时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools?.map((pool) => (
            <TableRow key={pool.id}>
              <TableCell>{pool.id}</TableCell>
              <TableCell>{pool.name}</TableCell>
              <TableCell>{pool.liquidity}</TableCell>
              <TableCell>{new Date(pool.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
