import pool from '../config/database.js';
import { filterAllowedFields, ALLOWED_FIELDS } from '../utils/validation.js';

class Staff {
  static async create(data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.staff);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const placeholders = fields.map(() => '?');
    
    const query = `
      INSERT INTO staff (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;
    
    const [result] = await pool.query(query, values);
    
    // Fetch the created record
    const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM staff WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM staff WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM staff WHERE 1=1';
    const values = [];

    if (filters.role) {
      query += ' AND role = ?';
      values.push(filters.role);
    }

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      values.push(filters.is_active);
    }

    query += ' ORDER BY created_date DESC';

    const [rows] = await pool.query(query, values);
    return rows;
  }

  static async update(id, data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.staff);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const setClause = fields.map(key => `${key} = ?`).join(', ');
    
    const query = `
      UPDATE staff
      SET ${setClause}
      WHERE id = ?
    `;
    
    await pool.query(query, [...values, id]);
    
    // Fetch the updated record
    const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    // Fetch before deleting
    const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [id]);
    const staff = rows[0];
    
    const query = 'DELETE FROM staff WHERE id = ?';
    await pool.query(query, [id]);
    return staff;
  }
}

export default Staff;
