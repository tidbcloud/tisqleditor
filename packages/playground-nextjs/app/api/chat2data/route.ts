import { mockChat2Data } from '../../../../../mocks/chat'

export async function POST(req: Request) {
  return mockChat2Data(req)
}
