import { Client } from 'pg';

export class DatabaseClient {
  private client: Client;

  constructor(host: string, port: number) {
    this.client = new Client({
      host,
      port,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'insurance_db',
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const res = await this.client.query(sql, params);
    return res.rows;
  }

  async getPolicyDetails(policyId: string) {
    const records = await this.query(`SELECT * FROM policies WHERE policy_id = $1`, [policyId]);
    return records[0];
  }
}