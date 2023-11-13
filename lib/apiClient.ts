
import { DefaultApi, Configuration } from '../types/api'
import axios from 'axios'

export const buildApiClient = () => {
  const configuration = new Configuration()
  axios.defaults.withCredentials = true
  let baseUrl = process.env.NEXT_PUBLIC_API_ROOT_URL!
  if (baseUrl.startsWith('/')) {
    const host = window.location.origin
    baseUrl = host + baseUrl
  }
  return new DefaultApi(configuration, baseUrl, axios)
}
