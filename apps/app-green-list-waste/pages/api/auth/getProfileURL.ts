export default function handler(req, res) {
  const domain = new URL(process.env.DCID_WELLKNOWN);
  res.status(200).json({ url: domain.origin });
}
