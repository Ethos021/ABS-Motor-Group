import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create(data) {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const query = `
      INSERT INTO users (full_name, email, password_hash, role, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.full_name,
      data.email,
      hashedPassword,
      data.role || 'user',
      data.created_by || null
    ];
    
    const [result] = await pool.query(query, values);
    
    // Fetch the created record
    const [rows] = await pool.query('SELECT id, created_date, updated_date, full_name, email, role FROM users WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, created_date, updated_date, full_name, email, role FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, created_date, updated_date, full_name, email, role FROM users ORDER BY created_date DESC';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.full_name !== undefined) {
      fields.push('full_name = ?');
      values.push(data.full_name);
    }

    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }

    if (data.role !== undefined) {
      fields.push('role = ?');
      values.push(data.role);
    }

    if (data.password !== undefined) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      fields.push('password_hash = ?');
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ?
    `;
    
    await pool.query(query, values);
    
    // Fetch the updated record
    const [rows] = await pool.query('SELECT id, created_date, updated_date, full_name, email, role FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    // Fetch before deleting
    const [rows] = await pool.query('SELECT id, full_name, email FROM users WHERE id = ?', [id]);
    const user = rows[0];
    
    const query = 'DELETE FROM users WHERE id = ?';
    await pool.query(query, [id]);
    return user;
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
