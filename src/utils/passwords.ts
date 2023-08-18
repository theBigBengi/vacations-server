import bcrypt from "bcrypt";

export const hash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
};

export const compareHash = (
  originalHash: string,
  storedHash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(originalHash, storedHash, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
