import { ewcCodes } from './ewcCodes';

export default function handler(req, res) {
  const ewcCode = req.query.code;

  if (req.method !== 'GET') {
    res.status(400).json({ error: 'Bad Request' });
  }

  if (ewcCode === undefined) {
    res.status(404).json({ error: 'Not Found' });
  }

  if (ewcCode.length !== 6) {
    res.status(404).json({ error: 'Not Found' });
  }

  if (ewcCode.length === 6) {
    const result = ewcCodes.find(({ code }) => code === ewcCode);
    if (result !== undefined) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  }
}
