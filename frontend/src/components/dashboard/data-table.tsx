export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border)]">
          <thead className="bg-[var(--bg-primary)]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map((row, rowIndex) => (
              <tr key={`${row[0]}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className="px-5 py-4 text-sm text-[var(--text-primary)]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
