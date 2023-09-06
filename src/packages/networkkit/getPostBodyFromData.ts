export async function getPostData(request: Request) {
  const postData = await request.json()
  return postData
}
