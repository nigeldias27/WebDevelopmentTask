// This web app was created using Next.js, TailwindCSS and MaterialUI by Nigel Dias

import { questions } from "@/models/listofquestions"; // Would be in the form ["question":...,"options":[...,...]]. Allows dynamic addition of questions
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Alert from "@mui/material/Alert";

export default function Home() {
  const [question, setQuestion] = useState([]); // List of answers in the form [answer1,answer2]
  const [invalid, setInvalid] = useState(false); // Variable that contains the condition of whether the questions were answered or not
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r pb-32 pt-16 from-purple-400 to-purple-500 min-h-screen">
      <Head>
        <title>Respondent Travel profile</title>
      </Head>
      <h1 className="text-3xl mx-20 mb-8 font-bold">IISC Test 4</h1>
      <div className="rounded-md shadow-2xl text-lg shadow-purple-700 mx-8  bg-purple-100 bg-opacity-60 px-12 py-16">
        {questions.map((v, index) => {
          // Mapping the data of a list of objects to jsx elements
          return (
            <div key={index}>
              <h1 className="py-12 font-bold">{v.question}</h1>
              {v.options.map((vi, innerindex) => {
                //value of vi is each option/ answer
                return (
                  <div key={innerindex} class="flex items-center mb-4">
                    <input
                      type="radio"
                      value={vi}
                      onChange={(event) => {
                        question[index] = event.target.value; //Once an option is selected, it updates the "questions" list
                        setQuestion([...question]);
                      }}
                      name={v.question}
                      class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 checked:bg-purple-600 focus:ring-purple-500  dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                    ></input>
                    <label
                      for="default-radio-1"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {vi}
                    </label>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div className="flex justify-end">
          <button
            class="x-6 drop-shadow-xl font-small rounded-md bg-gradient-to-r from-purple-400 to-purple-500 py-3 px-8 text-white"
            type="submit"
            onClick={() => {
              if (question.length == 2) {
                localStorage.setItem("answers", JSON.stringify(question)); //Saving the answers to localStorage
                router.push("/page2"); //Navigate to the next page
              } else {
                setInvalid(true);
              }
            }}
          >
            <div className="flex flex-row items-center">
              <span className="text-lg">Next Page</span>
            </div>
          </button>
        </div>
        {invalid == true ? ( //If the answers are not selected before the submit button is clicked, this error message is rendered
          <div className="pt-8">
            {" "}
            <Alert severity="error">
              Please answer the above questions to proceed
            </Alert>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
