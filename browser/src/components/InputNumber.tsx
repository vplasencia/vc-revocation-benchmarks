export type InputProps = {
  title: string
  defaultValue?: number
  onChange: (value: number) => void
}

export default function InputNumber({
  title,
  defaultValue,
  onChange
}: InputProps) {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="font-bold">{title}:</div>
      <input
        type="number"
        id="number-input"
        aria-describedby="number-input"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-20 p-2.5"
        placeholder="0"
        required
        min={0}
        defaultValue={defaultValue}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
