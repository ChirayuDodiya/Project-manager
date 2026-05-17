import jwt from 'jsonwebtoken';

//creates access token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d',
  });
};

export { generateAccessToken };
