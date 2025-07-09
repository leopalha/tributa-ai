import * as React from 'react';
import InputMask from 'react-input-mask-next';
import { Input, InputProps } from '@/components/ui/input'; // Assuming shadcn/ui Input

interface CnpjInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CnpjInput = React.forwardRef<HTMLInputElement, CnpjInputProps>(
  ({ value, onChange, ...props }, ref) => {
    return (
      <InputMask mask="99.999.999/9999-99" value={value} onChange={onChange} maskChar={null}>
        {(inputProps: InputMaskProps) => {
          const { children, ...restInputProps } = inputProps;
          return (
            <Input
              {...props}
              {...restInputProps}
              ref={ref}
              placeholder={props.placeholder || '00.000.000/0000-00'}
            />
          );
        }}
      </InputMask>
    );
  }
);

CnpjInput.displayName = 'CnpjInput';

export { CnpjInput };
