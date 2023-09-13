import {
  IRecyclingMaterial,
  IReward,
  RecyclingMaterial,
  Reward,
} from "../models";

export async function seed() {
  const rewardData: Array<IReward> = [
    {
      title: "starbuck 5$",
      points: 30,
      logo: "/imgs/starbuck_logo.png",
    },
    {
      title: "starbuck 10$",
      points: 50,
      logo: "/imgs/starbuck_logo.png",
    },
    {
      title: "starbuck 20$",
      points: 80,
      logo: "/imgs/starbuck_logo.png",
    },
    {
      title: "starbuck 30$",
      points: 100,
      logo: "/imgs/starbuck_logo.png",
    },
    {
      title: "starbuck 40$",
      points: 150,
      logo: "/imgs/starbuck_logo.png",
    },
  ];

  const materialData: IRecyclingMaterial[] = [
    {
      name: "plastic",
      points: 30,
    },
    {
      name: "metal",
      points: 20,
    },
  ];

  await Reward.insertMany(rewardData);
  await RecyclingMaterial.insertMany(materialData);
}