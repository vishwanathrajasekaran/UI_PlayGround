export default function handler(req, res) {
  return res.status(200).json({
    message: 'ok',
    itemCount: 17,
    servedAt: new Date().toISOString(),
  })
}
