export const VacationsQueries = {
  fields: [""],
  //   GetVacations: `
  //   SELECT
  //   v.id,
  //   v.destination,
  //   v.starting_date AS startingDate,
  //   v.ending_date AS endingDate,
  //   v.description,
  //   v.price,
  //   v.img_url AS imgUrl,
  //   IF(COUNT(f.vacation_id) > 0, JSON_ARRAYAGG(f.user_id), '[]')  AS followers
  //    FROM vacations AS v
  //    LEFT JOIN followers  AS f
  //    ON v.id = f.vacation_id

  //       `,
  GetVacations: `
  SELECT * FROM vacations 

      `,
  //       `,
  getVacationsWithFollowers: (id?: number) => {
    let query = "";

    query += `
      SELECT vac.*, 
             IF(COUNT(followers.vacation_id) > 0, CONCAT('[', GROUP_CONCAT(CONCAT(followers.user_id) SEPARATOR ','), ']'), '[]') AS followers 
      FROM (SELECT * FROM vacations) AS vac 
      LEFT JOIN followers ON vac.id = followers.vacation_id
    `;

    if (id) {
      query += ` WHERE followers.user_id = ${id} `;
    }

    query += " GROUP BY vac.id ";

    return query;
  },

  GetVacationsById: `
  SELECT
    v.id,
    v.destination,
    v.starting_date AS startingDate,
    v.ending_date AS endingDate,
    v.description,
    v.price,
    v.img_url AS imgUrl,
    IF(COUNT(f.vacation_id) > 0, CONCAT('[', GROUP_CONCAT(CONCAT(f.user_id) SEPARATOR ','), ']'), '[]') AS followers
  FROM vacations AS v
  LEFT JOIN followers AS f ON v.id = f.vacation_id
  WHERE v.id = ?
  GROUP BY v.id
`,

  AddVacation: `
      INSERT INTO vacations (destination, description, starting_date, ending_date, price, img_url)
        VALUES (?, ?, ?, ?, ?, ?);
      `,

  UpdateVacationById: `
      UPDATE vacations
      SET destination = ?,
          description = ?,
          starting_date = ?,    
          ending_date = ?,
          price = ?,
          img_url = ?
      WHERE id = ?
      `,

  DeleteVacationById: `
      DELETE FROM vacations
      WHERE id = ?
      `,

  GetFollowersReports: `
    SELECT v.id, v.destination, COUNT(f.user_id) AS count, v.id AS vacationId 
    FROM vacations  AS v
    LEFT JOIN followers  AS f
    ON v.id = f.vacation_id
    GROUP BY v.id
    `,
  // GROUP BY g.id
};
