export default function handler(req, res) {
  return res.status(500).json({
    error: 'Internal Server Error',
    servedAt: new Date().toISOString(),
  })
}
