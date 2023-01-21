import { useState } from "react";
import { Grid, TextField, Button } from '@mui/material';

type SingleTextInputProps = {
  labelText: string;
  buttonText: string
  action: (input: string) => void;
}

function SingleTextInput ({labelText, buttonText, action}: SingleTextInputProps) {
  const [input, setInput] = useState('');

  function submit (e: React.KeyboardEvent | React.MouseEvent) {
    e.preventDefault();
    action(input);
    setInput('');
  }

  return (
    <form>
      <Grid container sx={{ mx: 2 }}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            label={labelText}
            multiline
            variant="standard"
            name="input"
            value={input}
            onKeyDown={(e) => {
              // allow enter to submit, shift + enter for a new line
              if (e.code === 'Enter' && !e.shiftKey) {
                submit(e);
              }
            }}
            onChange={e => setInput(e.target.value)}/>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            onClick={(e) => submit(e)} >
            {buttonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default SingleTextInput;