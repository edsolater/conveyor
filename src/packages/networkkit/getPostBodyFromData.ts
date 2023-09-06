export async function getPostBodyFromData(request: Request) {
  const postData = await request.json()
  return postData
}
