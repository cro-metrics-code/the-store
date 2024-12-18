import { cn } from '@/lib/utils';
import { Input, type InputProps } from '@/ui/shadcn/input';
import { Label } from '@/ui/shadcn/label';
import { type ReactNode, useMemo } from 'react';

export interface ElWithErrorsProps extends InputProps {
  errors: undefined | null | Record<string, string[] | undefined | null>;
  label: string;
}

export const ElWithErrors = ({
  errors,
  name,
  className,
  label,
  children,
  autoComplete,
  value,
}: Omit<ElWithErrorsProps, 'children'> & {
  children: (props: InputProps) => ReactNode;
}) => {
  const currentErrors = errors && name && name in errors ? errors[name] : null;
  const id = name ? `input-${name}` : undefined;

  const child = useMemo(() => {
    return children({
      autoComplete,
      value,
      name,
      className: cn(className, currentErrors?.length && 'border-destructive'),
      'aria-invalid': !!currentErrors?.length,
      'aria-errormessage': id,
    });
  }, [
    children,
    className,
    currentErrors?.length,
    id,
    name,
    autoComplete,
    value,
  ]);

  return (
    <Label>
      <span>{label}</span>
      <span id={id} aria-live="assertive">
        {currentErrors?.map((error) => (
          <span
            key={error}
            className="ml-2 text-xs leading-none text-destructive"
          >
            {error}
          </span>
        ))}
      </span>
      {child}
    </Label>
  );
};

export const InputWithErrors = (props: ElWithErrorsProps) => (
  <ElWithErrors {...props}>
    {(innerProps) => <Input {...innerProps} />}
  </ElWithErrors>
);
