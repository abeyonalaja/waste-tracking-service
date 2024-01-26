import { getToken } from 'next-auth/jwt';

const getDCIDToken = async (req, res) => {
  const token = await getToken({ req });
  if (token) {
    res.status(200).json({ token: token.id_token });
  }
  res.end();
};

export default getDCIDToken;
