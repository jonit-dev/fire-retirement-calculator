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
    const val = type === 'date' ? new Date(e.target.value) : Number(e.target.value);
    onChange(val as T);
  };

  const inputValue = type === 'date' ? (value as Date).toISOString().substr(0, 10) : (value as unknown as string | number);

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
