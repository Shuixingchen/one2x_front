import mysql from 'mysql2/promise'

// 创建数据库连接池
const client = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'one2x',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// 定义Pool类型
export interface Pool {
  id: string
  name: string
  liquidity: number
  created_at: Date
}

// 定义错误类型
class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * 数据库查询工具
 */
export const db = {
  /**
   * 执行SQL查询的通用方法
   */
  async query<T>(sql: string, params?: any[]): Promise<T> {
    try {
      const [rows] = await client.query(sql, params)
      return rows as T
    } catch (error) {
      console.error('数据库查询失败:', error)
      throw new DatabaseError('数据库查询失败', error)
    }
  },

  /**
   * 获取所有池列表
   */
  async getAllPools(): Promise<Pool[]> {
    return this.query<Pool[]>('SELECT * FROM t_one2x_pools')
  },

  /**
   * 根据ID获取特定池
   */
  async getPoolById(id: string): Promise<Pool | null> {
    const pools = await this.query<Pool[]>('SELECT * FROM t_one2x_pools WHERE id = ?', [id])
    return pools.length > 0 ? pools[0] : null
  },

  /**
   * 创建新池
   */
  async createPool(pool: Omit<Pool, 'id' | 'created_at'>): Promise<string> {
    const result = await this.query<mysql.ResultSetHeader>(
      'INSERT INTO t_one2x_pools (name, liquidity) VALUES (?, ?)',
      [pool.name, pool.liquidity]
    )
    return result.insertId.toString()
  },

  /**
   * 更新池信息
   */
  async updatePool(id: string, data: Partial<Omit<Pool, 'id' | 'created_at'>>): Promise<boolean> {
    const entries = Object.entries(data)
    if (entries.length === 0) return false

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ')
    const values = entries.map(([_, value]) => value)
    
    const result = await this.query<mysql.ResultSetHeader>(
      `UPDATE t_one2x_pools SET ${setClause} WHERE id = ?`,
      [...values, id]
    )
    
    return result.affectedRows > 0
  },

  /**
   * 删除池
   */
  async deletePool(id: string): Promise<boolean> {
    const result = await this.query<mysql.ResultSetHeader>(
      'DELETE FROM t_one2x_pools WHERE id = ?',
      [id]
    )
    return result.affectedRows > 0
  }
}