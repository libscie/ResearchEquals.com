import axios from "axios"

const handlePayment = (url, router, toast, antiCSRFToken) => {
  axios
    .post(url, {}, { headers: { "anti-csrf": antiCSRFToken } })
    .then((resp) => {
      router.push(resp.data.url).catch((e) => toast.error(e.message))
    })
    .catch((e) => {
      toast.error(e.message)
      console.log(e)
    })
}

export default handlePayment
