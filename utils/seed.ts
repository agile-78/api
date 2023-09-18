import {
  IRecyclingMaterial,
  IReward,
  RecyclingMaterial,
  Reward,
} from "../models";

export async function seed() {
  const rewardData: Array<IReward> = [
    {
      title: "5$ voucher Starbuck",
      points: 500,
      logo: "/starbuck_logo.png",
    },
    {
      title: "$5 voucher Liho",
      points: 500,
      logo: "/liho.png",
    },
    {
      title: "$5 voucher Burger king",
      points: 500,
      logo: "/burger_king.png",
    },
  ];

  const materialData: IRecyclingMaterial[] = [
    {
      name: "Plastic Bottle",
      points: 30,
    },
    {
      name: "Aluminium Can",
      points: 20,
    },
    {
      name: "Paper",
      points: 10,
    },
  ];

  await Reward.insertMany(rewardData);
  await RecyclingMaterial.insertMany(materialData);
}
