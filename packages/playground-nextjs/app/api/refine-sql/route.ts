import { mockRefineSql } from '../../../../../mocks/chat'

export async function POST(req: Request) {
  return mockRefineSql(req)
}
