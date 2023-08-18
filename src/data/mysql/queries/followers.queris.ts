export const FollowersQueries = {
  GetFollowers: `
        SELECT id, user_id, vacation_id
        FROM followers
        `,

  GetFollowerById: `
        SELECT id, user_id, vacation_id
        FROM followers
        WHERE id = ?
        `,

  getFollowerByUserVacation: `
        SELECT id, user_id, vacation_id
        FROM followers
        WHERE vacation_id = ?
        AND user_id = ?
        `,

  AddFollower: `
        INSERT INTO followers (vacation_id, user_id)
          VALUES (?, ?);
        `,

  UpdateFollowerById: `
        UPDATE v.followers
        SET ?
        WHERE id = ?
        `,

  DeleteFollowerById: `
        DELETE FROM followers
        WHERE id = ?
        `,
};
