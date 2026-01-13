import pool from '../config/database.js';
import { filterAllowedFields, ALLOWED_FIELDS } from '../utils/validation.js';

class CalendarBlock {
  static async create(data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.calendarBlock);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const placeholders = fields.map(() => '?');
    
    const query = `
      INSERT INTO calendar_blocks (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;
    
    const [result] = await pool.query(query, values);
    
    // Fetch the created record
    const [rows] = await pool.query('SELECT * FROM calendar_blocks WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM calendar_blocks WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM calendar_blocks WHERE 1=1';
    const values = [];

    if (filters.staff_id) {
      query += ' AND staff_id = ?';
      values.push(filters.staff_id);
    }

    if (filters.block_type) {
      query += ' AND block_type = ?';
      values.push(filters.block_type);
    }

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      values.push(filters.is_active);
    }

    if (filters.start_date) {
      query += ' AND start_datetime >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND end_datetime <= ?';
      values.push(filters.end_date);
    }

    query += ' ORDER BY start_datetime ASC';

    const [rows] = await pool.query(query, values);
    return rows;
  }

  static async findByDateRange(startDate, endDate, staffId = null) {
    let query = `
      SELECT * FROM calendar_blocks
      WHERE end_datetime >= ? AND start_datetime <= ?
    `;
    const values = [startDate, endDate];

    if (staffId) {
      query += ' AND staff_id = ?';
      values.push(staffId);
    }

    query += ' ORDER BY start_datetime ASC';

    const [rows] = await pool.query(query, values);
    return rows;
  }

  static async update(id, data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.calendarBlock);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const setClause = fields.map(key => `${key} = ?`).join(', ');
    
    const query = `
      UPDATE calendar_blocks
      SET ${setClause}
      WHERE id = ?
    `;
    
    await pool.query(query, [...values, id]);
    
    // Fetch the updated record
    const [rows] = await pool.query('SELECT * FROM calendar_blocks WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    // Fetch before deleting
    const [rows] = await pool.query('SELECT * FROM calendar_blocks WHERE id = ?', [id]);
    const block = rows[0];
    
    const query = 'DELETE FROM calendar_blocks WHERE id = ?';
    await pool.query(query, [id]);
    return block;
  }
}

export default CalendarBlock;
