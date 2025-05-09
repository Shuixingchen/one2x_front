import { db } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const pools = await db.getAllPools()
    return NextResponse.json(pools)
  } catch (error) {
    console.error('获取池列表失败:', error)
    return NextResponse.json(
      { error: '获取池列表失败' },
      { status: 500 }
    )
  }
}