import pool from '../config/database.js';

class Staff {
  static async create(data) {
    const fields = Object.keys(data).filter(key => data[key] !== undefined);
    const values = fields.map(key => data[key]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);
    
    const query = `
      INSERT INTO staff (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM staff WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM staff WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM staff WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.role) {
      query += ` AND role = $${paramCount}`;
      values.push(filters.role);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    query += ' ORDER BY created_date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).filter(key => data[key] !== undefined);
    const values = fields.map(key => data[key]);
    const setClause = fields.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE staff
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM staff WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default Staff;
