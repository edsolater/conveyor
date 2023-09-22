import { APIEvent } from 'solid-start'

export async function POST({ request }: APIEvent) {
  const formDataPromise = request.formData()
  const fd = formDataPromise.then((fd) => {
    fd.forEach((value, key) => {
      console.log(key, value)
    })
  })
}
