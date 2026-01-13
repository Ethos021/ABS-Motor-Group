import pool from '../config/database.js';
import { filterAllowedFields, ALLOWED_FIELDS } from '../utils/validation.js';

class Enquiry {
  static async create(data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.enquiry);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const placeholders = fields.map(() => '?');
    
    const query = `
      INSERT INTO enquiries (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;
    
    const [result] = await pool.query(query, values);
    
    // Fetch the created record
    const [rows] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM enquiries WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM enquiries WHERE 1=1';
    const values = [];

    if (filters.status) {
      query += ' AND status = ?';
      values.push(filters.status);
    }

    if (filters.enquiry_type) {
      query += ' AND enquiry_type = ?';
      values.push(filters.enquiry_type);
    }

    if (filters.assignedStaffId) {
      query += ' AND assignedStaffId = ?';
      values.push(filters.assignedStaffId);
    }

    query += ' ORDER BY created_date DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      values.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      values.push(filters.offset);
    }

    const [rows] = await pool.query(query, values);
    return rows;
  }

  static async update(id, data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.enquiry);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const setClause = fields.map(key => `${key} = ?`).join(', ');
    
    const query = `
      UPDATE enquiries
      SET ${setClause}
      WHERE id = ?
    `;
    
    await pool.query(query, [...values, id]);
    
    // Fetch the updated record
    const [rows] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    // Fetch before deleting
    const [rows] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [id]);
    const enquiry = rows[0];
    
    const query = 'DELETE FROM enquiries WHERE id = ?';
    await pool.query(query, [id]);
    return enquiry;
  }

  static async search(searchTerm) {
    const query = `
      SELECT * FROM enquiries
      WHERE 
        firstName LIKE ? OR
        lastName LIKE ? OR
        email LIKE ? OR
        mobile LIKE ? OR
        message LIKE ? OR
        vehicleDetails LIKE ?
      ORDER BY created_date DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.query(query, [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]);
    return rows;
  }
}

export default Enquiry;
