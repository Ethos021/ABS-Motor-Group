import pool from '../config/database.js';
import { filterAllowedFields, ALLOWED_FIELDS } from '../utils/validation.js';

class Booking {
  static async create(data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.booking);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);
    
    const query = `
      INSERT INTO bookings (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM bookings WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.booking_type) {
      query += ` AND booking_type = $${paramCount}`;
      values.push(filters.booking_type);
      paramCount++;
    }

    if (filters.staff_id) {
      query += ` AND staff_id = $${paramCount}`;
      values.push(filters.staff_id);
      paramCount++;
    }

    if (filters.enquiry_id) {
      query += ` AND enquiry_id = $${paramCount}`;
      values.push(filters.enquiry_id);
      paramCount++;
    }

    query += ' ORDER BY scheduled_datetime DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findByDateRange(startDate, endDate, staffId = null) {
    let query = `
      SELECT * FROM bookings
      WHERE scheduled_datetime >= $1 AND scheduled_datetime <= $2
    `;
    const values = [startDate, endDate];

    if (staffId) {
      query += ' AND staff_id = $3';
      values.push(staffId);
    }

    query += ' ORDER BY scheduled_datetime ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, data) {
    // Filter to only allowed fields
    const filteredData = filterAllowedFields(data, ALLOWED_FIELDS.booking);
    const fields = Object.keys(filteredData);
    const values = fields.map(key => filteredData[key]);
    const setClause = fields.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE bookings
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM bookings WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default Booking;
