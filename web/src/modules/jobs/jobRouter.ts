import axios from 'axios'
import converter from 'xml-js'
import { createRouter } from '../../server/createRouter'
const jobURL = 'https://fomo-gmbh.jobs.personio.de/xml?language=en'

export const jobRouter = createRouter().query('allJobs', {
  async resolve({ ctx, type }) {
    const { data } = await axios.get(jobURL)

    const jobs = converter.xml2js(data)
    return {
      data: jobs,
    }
  },
})
