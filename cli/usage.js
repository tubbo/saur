import { Task } from "../task.js";

const tasks = Task.all.map((task) => `${task.name} - ${task.description}`).join(
  "\n",
);

export default `Usage:
  saur COMMAND [ARGUMENTS] [options]

Description:
  The \`saur\` command is used to manage and create Saur applications
  on your development workstation.

  Run the following command to view more information:

      saur help COMMAND

Tasks:
  new - Create a new application
  generate - Generate code for your application
  server - Run the application server
  help - Show this help
  ${tasks}
`;
