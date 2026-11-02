import { mockJobStatus } from '../../../../../mocks/chat'

export async function GET(req: Request) {
  return mockJobStatus(req)
}
