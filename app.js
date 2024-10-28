/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { Container, Typography, TextField, Button, Box, Grid } = MaterialUI;

const initialWords = [
  "react", "javascript", "scramble", "bootstrap", "coding",
  "interface", "module", "state", "props", "component"
];
const maxStrikes = 3;
const maxPasses = 3;

const App = () => {
  const [scrambledWord, setScrambledWord] = React.useState('');
  const [currentWord, setCurrentWord] = React.useState('');
  const [userGuess, setUserGuess] = React.useState('');
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(maxPasses);
  const [gameOver, setGameOver] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState('');
  const [remainingWords, setRemainingWords] = React.useState([]);

  React.useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem('scrambleGame'));
    if (savedGame) {
      setPoints(savedGame.points);
      setStrikes(savedGame.strikes);
      setPasses(savedGame.passes);
      setCurrentWord(savedGame.currentWord);
      setScrambledWord(savedGame.scrambledWord);
      setRemainingWords(savedGame.remainingWords || []);
    } else {
      startNewGame();
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('scrambleGame', JSON.stringify({
      points,
      strikes,
      passes,
      currentWord,
      scrambledWord,
      remainingWords,
    }));
  }, [points, strikes, passes, currentWord, scrambledWord, remainingWords]);

  const startNewGame = () => {
    setPoints(0);
    setStrikes(0);
    setPasses(maxPasses);
    setFeedbackMessage('');
    const newShuffledWords = shuffle(initialWords);
    setRemainingWords(newShuffledWords);
    loadNextWord(newShuffledWords);
    setGameOver(false);
  };

  const loadNextWord = (words) => {
    if (words.length === 0) {
      setGameOver(true); // Game ends if no words are left
      return;
    }
    const newWord = words[0];
    setCurrentWord(newWord);
    setScrambledWord(shuffle(newWord));
    setRemainingWords(words.slice(1)); // Remove the loaded word
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGuess();
  }

  const handleGuess = () => {
    if (userGuess.toLowerCase() === currentWord) {
      setPoints(points + 1);
      setFeedbackMessage('Correct!');

      // Check if all words have been guessed
      if (remainingWords.length === 0) {
        setGameOver(true); // End game if the last word is guessed
      } else {
        loadNextWord(remainingWords); // Load next word
      }
    } else {
      setStrikes(strikes + 1);
      setFeedbackMessage('Incorrect!');
      if (strikes + 1 >= maxStrikes) setGameOver(true);
    }
    setUserGuess('');

    setTimeout(() => {
      setFeedbackMessage('');
    }, 3000);
  };

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      loadNextWord(remainingWords); // Load next word
    }
  };

  return (
    <Container
      maxWidth="md"
      style={{
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        marginTop: '50px',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h4" gutterBottom>Scramble Game</Typography>
      {gameOver ? (
        <Box>
          <Typography variant="h5" color="textSecondary">
            Game Over! You scored {points} points.
          </Typography>
          <Button variant="contained" color="primary" onClick={startNewGame} style={{ marginTop: '20px' }}>
            Play Again
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>Scrambled Word:</Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            <strong>{scrambledWord}</strong>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              label="Your Guess"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={6}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="secondary" fullWidth onClick={handlePass} disabled={passes <= 0}>
                  Pass ({passes} left)
                </Button>
              </Grid>
            </Grid>
          </form>
          {feedbackMessage && (
            <Typography variant="body1" style={{ marginTop: '20px', color: feedbackMessage === 'Correct!' ? 'green' : 'red' }}>
              {feedbackMessage}
            </Typography>
          )}
          <Typography variant="body1" style={{ marginTop: '20px' }}>
            Points: {points} | Strikes: {strikes}/{maxStrikes}
          </Typography>
        </>
      )}
    </Container>
  );
};
