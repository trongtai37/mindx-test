import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';

const getQuestions = async ({
  amount,
  category,
  type,
  difficulty,
}: {
  amount: number;
  category: string;
  type: string;
  difficulty: string;
}) => {
  const url = new URL('https://opentdb.com/api.php');
  amount && url.searchParams.append('amount', String(amount));
  category && url.searchParams.append('category', category);
  difficulty && url.searchParams.append('difficulty', difficulty);
  type && url.searchParams.append('type', type);
  const response = await fetch(url.toString());
  const json = await response.json();
  return json.results.map((item, id) => ({ ...item, id }));
};

const secondToMinFormat = (second: number) => {
  const min = String(Math.floor(second / 60)).padStart(2, '0');
  const sec = String(second % 60).padStart(2, '0');

  return `${min} : ${sec}`;
};

const Counter = ({
  durationInSecond,
  onTimeUp,
}: {
  durationInSecond: number;
  onTimeUp: () => void;
}) => {
  const [time, setTime] = React.useState(durationInSecond);
  const intervalRef = React.useRef(-1);

  React.useEffect(() => {
    if (time === 0) {
      onTimeUp();
    }
  }, [time]);

  React.useEffect(() => {
    setTime(durationInSecond);
    const schedule = () => {
      setTime((time) => Math.max(time - 1, 0));
    };

    intervalRef.current = setInterval(schedule, 1000) as any;

    return () => clearInterval(intervalRef.current);
  }, [durationInSecond]);

  return (
    <Typography variant="h5">{`Remaining Time: ${secondToMinFormat(
      time
    )}`}</Typography>
  );
};

const Question = ({
  item: { correct_answer, incorrect_answers, question, id },
  onSelect,
}: {
  item: {
    category: string;
    correct_answer: string;
    id: number;
    incorrect_answers: string[];
    question: string;
    type: string;
  };
  onSelect: (id: number, value: string) => void;
}) => {
  const options = incorrect_answers.concat(correct_answer);
  return (
    <FormControl sx={{ display: 'block', marginTop: 4 }}>
      <FormLabel id="controlled-radio-buttons-group">
        <Typography
          variant="h5"
          dangerouslySetInnerHTML={{
            __html: `Question ${id + 1}: ${question}?`,
          }}
        />
      </FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        onChange={(_, value) => onSelect(id, value)}
      >
        {options.map((op) => (
          <FormControlLabel
            value={op}
            control={<Radio />}
            label={<span dangerouslySetInnerHTML={{ __html: op }} />}
            key={op}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const Progress = () => {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const userAnswer = React.useRef({});
  const { amount, category, type, difficulty, duration } = router.query;

  const handleChooseAnswer = (questionId: number, value: string) => {
    userAnswer.current[questionId] = value;
  };

  React.useEffect(() => {
    if (amount) {
      getQuestions({ amount, category, type, difficulty }).then((question) => {
        console.log(question);
        setQuestions(question);
      });
    }
  }, [amount, category, type, difficulty]);

  if (isSubmitted) {
    const correctCount = questions.reduce((counter, item) => {
      if (item.correct_answer === userAnswer.current[item.id]) {
        return counter + 1;
      }

      return counter;
    }, 0);

    return (
      <Box
        sx={{
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Box
          sx={{
            margin: '0 auto',
            maxWidth: '60vw',
          }}
        >
          <Typography variant="h5">Your score:</Typography>
          <Typography variant="h5">{`${correctCount}/${questions.length}`}</Typography>
          <Button
            sx={{ marginTop: 4, marginRight: 2 }}
            onClick={() => router.push('/start')}
            variant="contained"
          >
            New
          </Button>
          <Button
            sx={{ marginTop: 4 }}
            onClick={() => {
              setIsSubmitted(false);
              userAnswer.current = {};
            }}
            variant="contained"
          >
            Retest again
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <Box
        sx={{
          margin: '0 auto',
          maxWidth: '60vw',
        }}
      >
        <Counter
          durationInSecond={Number(duration) * 60}
          onTimeUp={() => setIsSubmitted(true)}
        />
        <Typography variant="h3">Your Questions</Typography>
        {questions.map((q) => (
          <Question item={q} key={q.id} onSelect={handleChooseAnswer} />
        ))}
        <Button
          variant="contained"
          onClick={() => setIsSubmitted(true)}
          sx={{ margin: '0 auto', marginTop: 4 }}
        >
          Submit answer
        </Button>
      </Box>
    </Box>
  );
};

export default Progress;
