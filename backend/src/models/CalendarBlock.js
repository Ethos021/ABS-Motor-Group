import pool from '../config/database.js';

class CalendarBlock {
  static async create(data) {
    const fields = Object.keys(data).filter(key => data[key] !== undefined);
    const values = fields.map(key => data[key]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);
    
    const query = `
      INSERT INTO calendar_blocks (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM calendar_blocks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM calendar_blocks WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.staff_id) {
      query += ` AND staff_id = $${paramCount}`;
      values.push(filters.staff_id);
      paramCount++;
    }

    if (filters.block_type) {
      query += ` AND block_type = $${paramCount}`;
      values.push(filters.block_type);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    if (filters.start_date) {
      query += ` AND start_datetime >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      query += ` AND end_datetime <= $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    query += ' ORDER BY start_datetime ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findByDateRange(startDate, endDate, staffId = null) {
    let query = `
      SELECT * FROM calendar_blocks
      WHERE start_datetime <= $2 AND end_datetime >= $1
    `;
    const values = [startDate, endDate];

    if (staffId) {
      query += ' AND staff_id = $3';
      values.push(staffId);
    }

    query += ' ORDER BY start_datetime ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).filter(key => data[key] !== undefined);
    const values = fields.map(key => data[key]);
    const setClause = fields.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE calendar_blocks
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM calendar_blocks WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default CalendarBlock;
