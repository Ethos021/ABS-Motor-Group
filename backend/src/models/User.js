import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create(data) {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const query = `
      INSERT INTO users (full_name, email, password_hash, role, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_date, updated_date, full_name, email, role
    `;
    
    const values = [
      data.full_name,
      data.email,
      hashedPassword,
      data.role || 'user',
      data.created_by || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, created_date, updated_date, full_name, email, role FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, created_date, updated_date, full_name, email, role FROM users ORDER BY created_date DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.full_name !== undefined) {
      fields.push(`full_name = $${paramCount}`);
      values.push(data.full_name);
      paramCount++;
    }

    if (data.email !== undefined) {
      fields.push(`email = $${paramCount}`);
      values.push(data.email);
      paramCount++;
    }

    if (data.role !== undefined) {
      fields.push(`role = $${paramCount}`);
      values.push(data.role);
      paramCount++;
    }

    if (data.password !== undefined) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      fields.push(`password_hash = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, created_date, updated_date, full_name, email, role
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id, full_name, email';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default User;
