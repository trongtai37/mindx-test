import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';

const difficulties = [
  {
    label: 'Any Difficulty',
    value: 'any',
  },
  {
    label: 'Easy',
    value: 'easy',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Hard',
    value: 'hard',
  },
];

const questionTypes = [
  {
    label: 'Any Type',
    value: 'any',
  },
  {
    label: 'Multiple Choice',
    value: 'multiple',
  },
  {
    label: 'True / False',
    value: 'boolean',
  },
];

const categories = [
  {
    label: 'Any Category',
    value: 'any',
  },
  {
    label: 'General Knowledge',
    value: '9',
  },
  {
    label: 'Entertainment: Books',
    value: '10',
  },
];

const Start = () => {
  const router = useRouter();

  const [amount, setAmount] = React.useState<number>(10);
  const [duration, setDuration] = React.useState<number>(10);
  const [category, setCategory] = React.useState<string>('any');
  const [difficulty, setDifficulty] = React.useState<string>('any');
  const [type, setType] = React.useState<string>('any');

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
        <Typography variant="h4">
          Choose your questionnaire configuration
        </Typography>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <TextField
            type="number"
            label="Amount of question"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <TextField
            type="number"
            label="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id="select-label-category">Category</InputLabel>
          <Select
            label="Category"
            defaultValue="any"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cate) => (
              <MenuItem key={cate.value} value={cate.value}>
                {cate.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id="select-label-difficulty">Difficulty</InputLabel>
          <Select
            label="Category"
            defaultValue="any"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {difficulties.map((diff) => (
              <MenuItem key={diff.value} value={diff.value}>
                {diff.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id="select-label-question-type">Question Type</InputLabel>
          <Select
            label="Question Type"
            defaultValue="any"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {questionTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        sx={{
          display: 'block',
          margin: '0 auto',
          marginTop: 2,
        }}
        size="large"
        onClick={() => {
          router.push(
            `/progress?${Object.entries({
              amount,
              duration,
              category,
              type,
              difficulty,
            })
              .filter(([key, val]) => val !== 'any')
              .map((item) => item.join('='))
              .join('&')}`
          );
        }}
      >
        Start
      </Button>
    </Box>
  );
};

export default Start;
