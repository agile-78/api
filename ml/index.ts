import { io, loadGraphModel } from "@tensorflow/tfjs-node";

export async function load() {
  const handler = io.fileSystem("./model/model.json");
  const model = await loadGraphModel(handler);
  return model;
}
