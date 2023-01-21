import { useState } from "react";

type SingleTextInputProps = {
  labelText: string;
  buttonText: string
  action: (input: string) => void;
}

function SingleTextInput ({labelText, buttonText, action}: SingleTextInputProps) {
  const [input, setInput] = useState('');

  return (
    <form>
      <label htmlFor="input">{labelText}</label>
      <input type="text" name="input" id="input" value={input} onChange={e => setInput(e.target.value)}/>
      <button onClick={(e) => {
        e.preventDefault();
        action(input);
        setInput('');
      }}>{buttonText}</button>
    </form>
  )
}

export default SingleTextInput;