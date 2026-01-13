import pool from '../config/database.js';
import { filterAllowedFields, ALLOWED_FIELDS } from '../utils/validation.js';

class Booking {
  static async create(data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.booking);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const placeholders = fields.map(() => '?');
    
    const query = `
      INSERT INTO bookings (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;
    
    const [result] = await pool.query(query, values);
    
    // Fetch the created record
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM bookings WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const values = [];

    if (filters.status) {
      query += ' AND status = ?';
      values.push(filters.status);
    }

    if (filters.booking_type) {
      query += ' AND booking_type = ?';
      values.push(filters.booking_type);
    }

    if (filters.staff_id) {
      query += ' AND staff_id = ?';
      values.push(filters.staff_id);
    }

    if (filters.enquiry_id) {
      query += ' AND enquiry_id = ?';
      values.push(filters.enquiry_id);
    }

    query += ' ORDER BY scheduled_datetime DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      values.push(filters.limit);
    }

    const [rows] = await pool.query(query, values);
    return rows;
  }

  static async findByDateRange(startDate, endDate, staffId = null) {
    let query = `
      SELECT * FROM bookings
      WHERE scheduled_datetime >= ? AND scheduled_datetime <= ?
    `;
    const values = [startDate, endDate];

    if (staffId) {
      query += ' AND staff_id = ?';
      values.push(staffId);
    }

    query += ' ORDER BY scheduled_datetime ASC';

    const [rows] = await pool.query(query, values);
    return rows;
  }

  static async update(id, data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.booking);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const setClause = fields.map(key => `${key} = ?`).join(', ');
    
    const query = `
      UPDATE bookings
      SET ${setClause}
      WHERE id = ?
    `;
    
    await pool.query(query, [...values, id]);
    
    // Fetch the updated record
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    // Fetch before deleting
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    const booking = rows[0];
    
    const query = 'DELETE FROM bookings WHERE id = ?';
    await pool.query(query, [id]);
    return booking;
  }
}

export default Booking;
