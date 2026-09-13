export default async function handler(req, res) {
  await new Promise((resolve) => setTimeout(resolve, 4000))
  return res.status(200).json({
    message: 'slow response completed',
    delayMs: 4000,
    servedAt: new Date().toISOString(),
  })
}
