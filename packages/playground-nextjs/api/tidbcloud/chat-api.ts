import { delay } from '@/lib/delay'
import { ChatRes } from '@tidbcloud/codemirror-extension-ai-widget'

//---------------------------------
// a simple way to cancel loop query

const queryingJobs: Map<string, boolean> = new Map()

export function cancelChat(chatId: string) {
  queryingJobs.delete(chatId)
}

//---------------------------------

async function queryJobStatus(jobId: string) {
  // res example:
  // ---------
  // for refine sql job:
  // {
  //   "code": 200,
  //   "msg": "",
  //   "result": {
  //       "ended_at": 1719471325,
  //       "job_id": "f80099a82d20475d8da24b20dc817e67",
  //       "reason": "",
  //       "result": {
  //           "rewritten_sql": "SELECT * FROM `games` ORDER BY `recommendations` DESC LIMIT 10;",
  //           "solution": "To address the user feedback of limiting the results to 10 instead of 20, we can simply update the LIMIT clause in the SQL query."
  //       },
  //       "status": "done"
  //   }
  // }
  // ---------
  // for chat2data job:
  // {
  //   "code": 200,
  //   "msg": "",
  //   "result": {
  //       "ended_at": 1719461464,
  //       "job_id": "f6f46a745a264a50bf0e60163b670b9d",
  //       "reason": "",
  //       "result": {
  //           "sql": "SELECT * FROM `games` ORDER BY `recommendations` DESC LIMIT 20;",
  //           "sql_error": null
  //           // ...
  //       },
  //       "status": "done"
  //   }
  // }
  return fetch(`/api/jobs?job_id=${jobId}`)
    .then((res) => {
      if (res.status >= 400 || res.status < 200) {
        return res.json().then((d) => {
          throw new Error(d.msg)
        })
      }
      return res
    })
    .then((res) => res.json())
    .then((d) => d.result)
}

async function loopQueryJob(chatId: string, jobId: string): Promise<ChatRes> {
  // only try 5 times to reduce rate limit (current 100 times a day)
  let i = 5
  while (i > 0) {
    i--

    // check whether job is canceled
    if (!queryingJobs.get(chatId)) {
      return { status: 'error', message: 'chat is canceled', extra: {} }
    }

    const jobRes = await queryJobStatus(jobId)
    if (jobRes.status === 'done') {
      return {
        status: 'success',
        message: jobRes.result.rewritten_sql ?? jobRes.result.sql ?? '',
        extra: {}
      }
    } else if (jobRes.status === 'failed') {
      return { status: 'error', message: jobRes.reason, extra: {} }
    }
    await delay(10 * 1000)
  }
  throw new Error('Request timed out. Please try again.')
}

//-----------------

type Chat2DataReq = {
  database: string
  question: string
}

export async function chat2data(
  chatId: string,
  params: Chat2DataReq
): Promise<ChatRes> {
  queryingJobs.set(chatId, true)

  try {
    // res example:
    // {
    //   "code": 200,
    //   "msg": "",
    //   "result": {
    //       "cluster_id": "xxx",
    //       "database": "game",
    //       "job_id": "yyy",
    //       "session_id": zzz
    //   }
    // }
    const res = await fetch(`/api/chat2data`, {
      method: 'POST',
      body: JSON.stringify(params)
    })
      .then((res) => {
        if (res.status >= 400 || res.status < 200) {
          return res.json().then((d) => {
            throw new Error(d.msg)
          })
        }
        return res
      })
      .then((res) => res.json())
      .then((d) => d.result)

    const jobId = res.job_id
    const jobRes = await loopQueryJob(chatId, jobId)

    return jobRes
  } catch (error: any) {
    return { status: 'error', message: error.message, extra: {} }
  }
}

type RefineSqlReq = {
  database: string
  sql: string
  feedback: string
}

export async function refineSql(
  chatId: string,
  params: RefineSqlReq
): Promise<ChatRes> {
  queryingJobs.set(chatId, true)

  try {
    // res example:
    // {
    //   "code": 200,
    //   "msg": "",
    //   "result": {
    //       "job_id": "xxx",
    //       "session_id": "yyy"
    //   }
    // }
    const res = await fetch(`/api/refine-sql`, {
      method: 'POST',
      body: JSON.stringify(params)
    })
      .then((res) => {
        if (res.status >= 400 || res.status < 200) {
          return res.json().then((d) => {
            throw new Error(d.msg)
          })
        }
        return res
      })
      .then((res) => res.json())
      .then((d) => d.result)

    const jobId = res.job_id
    const jobRes = await loopQueryJob(chatId, jobId)

    return jobRes
  } catch (error: any) {
    return { status: 'error', message: error.message, extra: {} }
  }
}
