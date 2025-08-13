 import { Button as BootstrapButton} from 'react-bootstrap';
 interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const className = variant === 'primary' ? 'btn-custom' : 'btn-secondary-custom';
  return (
    <BootstrapButton className={className} {...props}>
      {children}
    </BootstrapButton>
  );
};
export default Button;  
