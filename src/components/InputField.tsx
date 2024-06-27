import dayjs from 'dayjs';
import { Input } from './Input';
import { Label } from './Label';

interface InputFieldProps<T> {
  id: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  type?: string;
}

const InputField = <T extends unknown>({ id, label, value, onChange, type = 'number' }: InputFieldProps<T>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = type === 'date' ? dayjs(e.target.value).toDate() : Number(e.target.value);
    onChange(val as T);
  };

  const inputValue = type === 'date' ? dayjs(value as Date).format('YYYY-MM-DD') : (value as unknown as string | number);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={inputValue}
        onChange={handleChange}
        className="mt-1 p-2 border rounded bg-gray-700 text-white"
      />
    </div>
  );
};

export default InputField;
