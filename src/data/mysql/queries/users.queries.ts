export const UsersQueries = {
  name: "users",
  GetUsers: `
      SELECT *
      FROM users
      `,

  GetUserById: `
      SELECT
      id,
      first_name,
      last_name,
      email,
      password,
      role
     
      FROM users
     
      WHERE id = ?
      `,

  getUserByEmail: `
      SELECT
      id,
      first_name,
      last_name,
      email,
      password,
      role
     
      FROM users
     
      WHERE email = ?
      `,

  InsertUser: `
      INSERT INTO users (first_name, last_name, email, password)
        VALUES (?, ?, ?, ?);
      `,

  UpdateUserById: `
      UPDATE users
      SET first_name = ?,
          last_name = ?,
          email = ?,
          password = ?
          role = ?
          WHERE id = ?
      `,

  DeleteUserById: `
      DELETE FROM users
      WHERE id = ?
      `,
};
