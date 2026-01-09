import pool from '../config/database.js';

class Enquiry {
  static async create(data) {
    const fields = Object.keys(data).filter(key => data[key] !== undefined);
    const values = fields.map(key => data[key]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);
    
    const query = `
      INSERT INTO enquiries (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM enquiries WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM enquiries WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.enquiry_type) {
      query += ` AND enquiry_type = $${paramCount}`;
      values.push(filters.enquiry_type);
      paramCount++;
    }

    if (filters.assignedStaffId) {
      query += ` AND assignedStaffId = $${paramCount}`;
      values.push(filters.assignedStaffId);
      paramCount++;
    }

    query += ' ORDER BY created_date DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, data) {
    const fields = Object.keys(data).filter(key => data[key] !== undefined);
    const values = fields.map(key => data[key]);
    const setClause = fields.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE enquiries
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM enquiries WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async search(searchTerm) {
    const query = `
      SELECT * FROM enquiries
      WHERE 
        firstName ILIKE $1 OR
        lastName ILIKE $1 OR
        email ILIKE $1 OR
        mobile ILIKE $1 OR
        message ILIKE $1 OR
        vehicleDetails ILIKE $1
      ORDER BY created_date DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

export default Enquiry;
