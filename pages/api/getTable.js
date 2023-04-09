import { crowd_json } from "@/models/crowd_json";
import { servtype_json } from "@/models/servtype_json";
import { promises as fs } from "fs";
import path from "path";
export default async function getTable(req, res) {
  const answers = req.body.questions; // Answers is of the form [Answer to the first question, Answer to the second question ]
  //Preprocessing the second answer to find the right JSON file by finding the number in the path which is assigned to lowerDistance
  let lowerDistance = answers[1].replace(">", "").replace(" ", "").slice(0, 2);
  lowerDistance =
    lowerDistance[0] == "<"
      ? "0"
      : lowerDistance[1] == "-" || lowerDistance[1] == "k"
      ? lowerDistance[0]
      : lowerDistance;
  const table = [];
  const jsonDirectory = path.join(process.cwd(), "db_JSON");
  //Reading the JSON file from the path found using fs library
  const fileContents = await fs.readFile(
    jsonDirectory + "/sample_db_" + lowerDistance + "km.json",
    "utf8"
  );
  const objData = JSON.parse(fileContents)["Data"][0]; // Converting string to JSON and getting the first object in present in the Data attribute

  const listofmodes = ["mode_1", "mode_2", "mode_4"]; //Saving the modes found while processing the first row to use to compute the following rows.
  //Lines 25 to 48 contains the processing of the first row based on the conditions given in the coding task
  table.push(["Bus Type 1", "Bus Type 2", objData["mode_4"]]);
  if (answers[0] == "Own Two-wheeler" || answers[0] == "Own Car") {
    table[0].push(answers[0]);
    listofmodes.push(answers[0] == "Own Two-wheeler" ? "mode_9" : "mode_8");
  } else {
    let choice = ["mode_9", "mode_8"][Math.floor(Math.random() * 2)]; // Selects a random choice
    table[0].push(objData[choice]);
    listofmodes.push(choice);
  }
  if (answers[0] == "Auto") {
    table[0].push(answers[0]);
    listofmodes.push(objData["mode_7"]);
  } else if (
    answers[0] == "App based ride hailing cab services including Ola / Uber"
  ) {
    table[0].push(objData["mode_5"]);
    listofmodes.push("mode_5");
  } else {
    let choice = ["mode_5", "mode_7"][Math.floor(Math.random() * 2)]; // Selects a random choice
    table[0].push(objData[choice]);
    listofmodes.push(choice);
  }

  //Processing of the second row based on the conditions given in the coding task

  table.push(
    listofmodes.map((v) => {
      if (objData[v + ".trans"] == 1) {
        return "1 transfer \n" + objData[v + ".ivtt"].toString() + " min";
      } else {
        return objData[v + ".ivtt"].toString() + " min";
      }
    })
  );
  //Processing of the third row based on the conditions given in the coding task
  table.push(
    listofmodes.map((v) => {
      return (
        (objData[v + ".walktime"] + objData[v + ".waittime"]).toString() +
        " min"
      );
    })
  );
  //Processing of the fourth row based on the conditions given in the coding task
  table.push(
    listofmodes.map((v) => {
      return "... up to " + objData[v + ".tvariab"].toString() + " min more";
    })
  );
  //Processing of the fifth row based on the conditions given in the coding task
  table.push(
    listofmodes.map((v) => {
      return "Rs." + objData[v + ".tcost"].toString();
    })
  );
  //Processing of the sixth row based on the conditions given in the coding task
  //crowd_json is present in the models/crowd_json.js file
  table.push(
    listofmodes.map((v) => {
      return crowd_json[objData[v + ".crowd"]].toString();
    })
  );
  //Processing of the seventh row based on the conditions given in the coding task
  //servtype_json is present in the models/servtype_json.js file
  table.push(
    listofmodes.map((v) => {
      return servtype_json[objData[v + ".serv"]].toString();
    })
  );
  //Return the content of the data file in json format
  res.status(200).json(table);
}
