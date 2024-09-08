import { Button } from '../button';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  return (
    <div className='grid grid-cols-4 gap-2'>
      <Button variant='outline' size='icon' onClick={() => onKeyPress('×')}>
        &#215;
      </Button>
      <Button variant='outline' size='icon' onClick={() => onKeyPress('∈')}>
        &#8712;
      </Button>
      <Button variant='outline' size='icon'>
        &#8713;
      </Button>
      <Button variant='outline' size='icon'>
        &#8800;
      </Button>
      <Button variant='outline' size='icon'>
        &#61;
      </Button>
      <Button variant='outline' size='icon'>
        &#43;
      </Button>
      <Button variant='outline' size='icon'>
        &#8722;
      </Button>
      <Button variant='outline' size='icon'>
        &#402;
      </Button>
    </div>
  );
};

export default Keyboard;
