import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { useStatementContext } from '@/contexts/statement-context'

export function ResultPanel() {
  const { runResult } = useStatementContext()

  if (runResult.status === 'error') {
    return (
      <div className="h-full p-4">
        <p>
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {runResult.statement}
          </code>
        </p>
        <p>Query Failed: {runResult.message}</p>
      </div>
    )
  }

  if (runResult.status === 'running') {
    return (
      <div className="h-full p-4">
        <p>
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {runResult.statement}
          </code>
        </p>
        <p>Running</p>
      </div>
    )
  }

  if (runResult.rowCount === 0) {
    return (
      <div className="h-full p-4">
        <p>
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {runResult.statement}
          </code>
        </p>
        <p>Query OK</p>
      </div>
    )
  }

  if (runResult.rowCount > 0) {
    return (
      <div className="h-full overflow-auto pb-4">
        <Table>
          <TableCaption>Show at most 10 results here</TableCaption>

          <TableHeader>
            <TableRow>
              {Object.keys(runResult.types).map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {runResult.rows.slice(0, 10).map((row: any, idx: any) => (
              <TableRow key={idx}>
                {row.map((item: any, c_idx: any) => (
                  <TableCell key={c_idx}>{item}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return null
}
