// import DateCounter from "./DateCounter";
import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import FinishScreen from "./FinishScreen";
import NextButton from "./NextButton";
import Progress from "./Progress";

const initialState = {
  questions: [],
  //'loading', 'error','ready','active','finish'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceiver":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "restart":
      // return { ...state, status: "ready", index: 0, answer: null, points: 0 };
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index, answer, points, highscore } = state;

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceiver", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  // console.log(questions);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <>
            {/* <p>1/15</p>
            <p>Questions?</p> */}
            <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
          </>
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
      {/* <DateCounter /> */}
    </div>
  );
}
